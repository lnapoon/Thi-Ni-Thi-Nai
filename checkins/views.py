from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse_lazy, reverse
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView, View, TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.contrib.auth.models import User
from django.contrib import messages
from django.core.exceptions import PermissionDenied
from django.http import JsonResponse
from django.db.models import Count, Q
from django.utils.timesince import timesince
from django.utils import timezone
from datetime import timedelta
import json

from .models import CheckIn, Like, Comment, Bookmark
from .forms import CheckInForm
from accounts.models import Follow, Profile


class FeedView(LoginRequiredMixin, ListView):
    model = CheckIn
    template_name = 'checkins/feed.html'
    context_object_name = 'checkins'
    paginate_by = 10

    def get_queryset(self):
        qs = CheckIn.objects.select_related('user', 'user__profile').prefetch_related(
            'likes',
            'bookmarks',
            'comments',
            'comments__user',
            'comments__user__profile'
        ).annotate(
            num_likes=Count('likes', distinct=True),
            num_comments=Count('comments', distinct=True)
        )
        return qs.order_by('-created_at')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        checkins_list = context.get('checkins', [])

        if self.request.user.is_authenticated:
            # Set of check-in IDs liked by current user
            context['user_liked_ids'] = set(
                Like.objects.filter(
                    user=self.request.user,
                    checkin__in=checkins_list
                ).values_list('checkin_id', flat=True)
            )
            # Set of check-in IDs bookmarked by current user
            context['user_bookmarked_ids'] = set(
                Bookmark.objects.filter(
                    user=self.request.user,
                    checkin__in=checkins_list
                ).values_list('checkin_id', flat=True)
            )
            # Set of user IDs followed by current user
            context['user_following_ids'] = set(
                Follow.objects.filter(
                    follower=self.request.user
                ).values_list('following_id', flat=True)
            )

        # Featured Active Travelers for Top Stories Bar
        context['featured_creators'] = User.objects.exclude(id=self.request.user.id).select_related('profile').annotate(
            post_count=Count('checkins')
        ).filter(post_count__gt=0).order_by('-post_count')[:10]

        context['active_tab'] = self.request.GET.get('tab', 'all')
        return context


class CheckInDetailView(LoginRequiredMixin, DetailView):
    model = CheckIn
    template_name = 'checkins/detail.html'
    context_object_name = 'checkin'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        checkin = self.get_object()
        user = self.request.user

        is_liked = False
        is_bookmarked = False
        is_following_author = False

        if user.is_authenticated:
            is_liked = checkin.likes.filter(user=user).exists()
            is_bookmarked = checkin.bookmarks.filter(user=user).exists()
            if checkin.user != user:
                is_following_author = Follow.objects.filter(follower=user, following=checkin.user).exists()

        context['is_liked'] = is_liked
        context['is_bookmarked'] = is_bookmarked
        context['is_following_author'] = is_following_author
        context['likes_count'] = checkin.likes.count()
        context['bookmarks_count'] = checkin.bookmarks.count()
        context['comments_count'] = checkin.comments.count()
        context['comments'] = checkin.comments.select_related('user', 'user__profile').order_by('created_at')
        context['is_owner'] = (checkin.user == user)
        return context


class CheckInCreateView(LoginRequiredMixin, CreateView):
    model = CheckIn
    form_class = CheckInForm
    template_name = 'checkins/form.html'

    def form_valid(self, form):
        form.instance.user = self.request.user
        messages.success(self.request, f'🎉 เช็คอินที่ "{form.instance.place_name}" สำเร็จแล้ว!')
        return super().form_valid(form)

    def form_invalid(self, form):
        messages.error(self.request, 'เกิดข้อผิดพลาดในการสร้างเช็คอิน กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง')
        return super().form_invalid(form)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['page_title'] = 'สร้างจุดเช็คอินใหม่'
        context['button_text'] = 'โพสต์เช็คอิน'
        return context


class CheckInUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    model = CheckIn
    form_class = CheckInForm
    template_name = 'checkins/form.html'

    def test_func(self):
        checkin = self.get_object()
        return checkin.user == self.request.user or self.request.user.is_staff or self.request.user.is_superuser

    def handle_no_permission(self):
        if self.request.user.is_authenticated:
            raise PermissionDenied("คุณไม่มีสิทธิ์แก้ไขเช็คอินนี้")
        return super().handle_no_permission()

    def form_valid(self, form):
        messages.success(self.request, f'✏️ แก้ไขข้อมูลเช็คอิน "{form.instance.place_name}" สำเร็จแล้ว!')
        return super().form_valid(form)

    def form_invalid(self, form):
        messages.error(self.request, 'เกิดข้อผิดพลาดในการแก้ไขข้อมูล กรุณาตรวจสอบข้อมูลอีกครั้ง')
        return super().form_invalid(form)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['page_title'] = f'แก้ไขเช็คอิน: {self.object.place_name}'
        context['button_text'] = 'บันทึกการแก้ไข'
        context['is_edit'] = True
        return context


class CheckInDeleteView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):
    model = CheckIn
    template_name = 'checkins/confirm_delete.html'
    success_url = reverse_lazy('checkins:feed')
    context_object_name = 'checkin'

    def test_func(self):
        checkin = self.get_object()
        return checkin.user == self.request.user or self.request.user.is_staff or self.request.user.is_superuser

    def handle_no_permission(self):
        if self.request.user.is_authenticated:
            raise PermissionDenied("คุณไม่มีสิทธิ์ลบเช็คอินนี้")
        return super().handle_no_permission()

    def delete(self, request, *args, **kwargs):
        checkin = self.get_object()
        place_name = checkin.place_name
        messages.info(request, f'🗑️ ลบเช็คอิน "{place_name}" เรียบร้อยแล้ว')
        return super().delete(request, *args, **kwargs)


class CheckInMapView(LoginRequiredMixin, TemplateView):
    template_name = 'checkins/map.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        geotagged_checkins = CheckIn.objects.filter(
            latitude__isnull=False,
            longitude__isnull=False
        ).select_related('user')[:50]
        context['geotagged_checkins'] = geotagged_checkins
        return context


class ToggleLikeView(LoginRequiredMixin, View):
    def post(self, request, pk):
        checkin = get_object_or_404(CheckIn, pk=pk)
        like_obj, created = Like.objects.get_or_create(user=request.user, checkin=checkin)

        if not created:
            like_obj.delete()
            liked = False
        else:
            liked = True

        likes_count = checkin.likes.count()

        if request.headers.get('x-requested-with') == 'XMLHttpRequest' or request.GET.get('format') == 'json':
            return JsonResponse({
                'success': True,
                'liked': liked,
                'likes_count': likes_count
            })

        next_url = request.POST.get('next', reverse('checkins:detail', kwargs={'pk': pk}))
        return redirect(next_url)


class ToggleBookmarkView(LoginRequiredMixin, View):
    def post(self, request, pk):
        checkin = get_object_or_404(CheckIn, pk=pk)
        bm_obj, created = Bookmark.objects.get_or_create(user=request.user, checkin=checkin)

        if not created:
            bm_obj.delete()
            bookmarked = False
        else:
            bookmarked = True

        bookmarks_count = checkin.bookmarks.count()

        if request.headers.get('x-requested-with') == 'XMLHttpRequest' or request.GET.get('format') == 'json':
            return JsonResponse({
                'success': True,
                'bookmarked': bookmarked,
                'bookmarks_count': bookmarks_count
            })

        next_url = request.POST.get('next', reverse('checkins:detail', kwargs={'pk': pk}))
        return redirect(next_url)


class CommentCreateView(LoginRequiredMixin, View):
    def post(self, request, pk):
        checkin = get_object_or_404(CheckIn, pk=pk)
        text = request.POST.get('text', '').strip()

        if not text:
            if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                return JsonResponse({'success': False, 'error': 'กรุณากรอกข้อความความคิดเห็น'}, status=400)
            messages.error(request, 'กรุณากรอกข้อความความคิดเห็น')
            return redirect('checkins:detail', pk=pk)

        comment = Comment.objects.create(
            checkin=checkin,
            user=request.user,
            text=text
        )

        if request.headers.get('x-requested-with') == 'XMLHttpRequest' or request.GET.get('format') == 'json':
            user_avatar = request.user.get_avatar_url
            return JsonResponse({
                'success': True,
                'comment': {
                    'id': comment.id,
                    'username': request.user.username,
                    'user_display': request.user.get_full_name() or request.user.username,
                    'avatar_url': user_avatar,
                    'text': comment.text,
                    'created_at_text': 'เมื่อสักครู่',
                    'can_delete': True,
                },
                'comments_count': checkin.comments.count(),
            })

        messages.success(request, 'ส่งความคิดเห็นเรียบร้อยแล้ว')
        next_url = request.POST.get('next', reverse('checkins:detail', kwargs={'pk': pk}))
        return redirect(next_url)


class CommentDeleteView(LoginRequiredMixin, View):
    def post(self, request, pk):
        comment = get_object_or_404(Comment, pk=pk)
        checkin = comment.checkin

        if comment.user != request.user and checkin.user != request.user and not request.user.is_staff:
            if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                return JsonResponse({'success': False, 'error': 'คุณไม่มีสิทธิ์ลบคอมเมนต์นี้'}, status=403)
            raise PermissionDenied("คุณไม่มีสิทธิ์ลบคอมเมนต์นี้")

        comment.delete()

        if request.headers.get('x-requested-with') == 'XMLHttpRequest' or request.GET.get('format') == 'json':
            return JsonResponse({
                'success': True,
                'comments_count': checkin.comments.count(),
            })

        messages.info(request, 'ลบความคิดเห็นเรียบร้อยแล้ว')
        next_url = request.POST.get('next', reverse('checkins:detail', kwargs={'pk': checkin.pk}))
        return redirect(next_url)


# =========================================================================
# PRO CUSTOM ADMIN DASHBOARD VIEWS
# =========================================================================

class CustomAdminDashboardView(LoginRequiredMixin, UserPassesTestMixin, TemplateView):
    template_name = 'dashboard/index.html'

    def test_func(self):
        return self.request.user.is_staff or self.request.user.is_superuser

    def handle_no_permission(self):
        messages.error(self.request, "เฉพาะผู้ดูแลระบบ (Admin) เท่านั้นที่สามารถเข้าถึงแดชบอร์ดนี้ได้")
        return redirect('checkins:feed')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        tab = self.request.GET.get('tab', 'overview')
        q = self.request.GET.get('q', '').strip()

        checkins_qs = CheckIn.objects.select_related('user', 'user__profile').annotate(
            num_likes=Count('likes', distinct=True),
            num_comments=Count('comments', distinct=True)
        ).order_by('-created_at')

        users_qs = User.objects.select_related('profile').annotate(
            num_checkins=Count('checkins', distinct=True)
        ).order_by('-date_joined')

        comments_qs = Comment.objects.select_related('user', 'user__profile', 'checkin').order_by('-created_at')

        # Filter by search
        if q:
            if tab == 'checkins':
                checkins_qs = checkins_qs.filter(
                    Q(place_name__icontains=q) | Q(caption__icontains=q) | Q(user__username__icontains=q)
                )
            elif tab == 'users':
                users_qs = users_qs.filter(
                    Q(username__icontains=q) | Q(first_name__icontains=q) | Q(last_name__icontains=q) | Q(email__icontains=q)
                )
            elif tab == 'comments':
                comments_qs = comments_qs.filter(
                    Q(text__icontains=q) | Q(user__username__icontains=q) | Q(checkin__place_name__icontains=q)
                )

        # High-level Metrics
        total_checkins = CheckIn.objects.count()
        total_users = User.objects.count()
        total_comments = Comment.objects.count()
        total_likes = Like.objects.count()
        total_bookmarks = Bookmark.objects.count()
        total_follows = Follow.objects.count()
        geotagged_count = CheckIn.objects.filter(latitude__isnull=False, longitude__isnull=False).count()
        geotagged_pct = int(geotagged_count / total_checkins * 100) if total_checkins > 0 else 0

        # Leaderboard Top 5 Places
        top_places = CheckIn.objects.annotate(
            num_likes=Count('likes', distinct=True),
            num_comments=Count('comments', distinct=True)
        ).select_related('user', 'user__profile').order_by('-num_likes', '-created_at')[:5]

        # Top 5 Contributors
        top_users = User.objects.annotate(
            num_checkins=Count('checkins', distinct=True)
        ).select_related('profile').order_by('-num_checkins')[:5]

        # Chart Data: Engagement Breakdown
        chart_engagement = {
            'labels': ['จุดเช็คอิน', 'ความคิดเห็น', 'ยอดถูกใจ', 'การบันทึก', 'การติดตาม'],
            'data': [total_checkins, total_comments, total_likes, total_bookmarks, total_follows]
        }

        context.update({
            'active_tab': tab,
            'search_query': q,
            'total_checkins': total_checkins,
            'total_users': total_users,
            'total_comments': total_comments,
            'total_likes': total_likes,
            'total_bookmarks': total_bookmarks,
            'total_follows': total_follows,
            'geotagged_count': geotagged_count,
            'geotagged_pct': geotagged_pct,
            'top_places': top_places,
            'top_users': top_users,
            'checkins_list': checkins_qs[:100],
            'users_list': users_qs[:100],
            'comments_list': comments_qs[:100],
            'recent_checkins': checkins_qs[:5],
            'recent_comments': comments_qs[:5],
            'chart_engagement_json': json.dumps(chart_engagement),
        })
        return context


class AdminDeleteCheckInActionView(LoginRequiredMixin, UserPassesTestMixin, View):
    def test_func(self):
        return self.request.user.is_staff or self.request.user.is_superuser

    def post(self, request, pk):
        checkin = get_object_or_404(CheckIn, pk=pk)
        place_name = checkin.place_name
        checkin.delete()
        messages.success(request, f'🗑️ ลบจุดเช็คอิน "{place_name}" เรียบร้อยแล้ว')
        return redirect(request.POST.get('next', '/dashboard/?tab=checkins'))


class AdminDeleteCommentActionView(LoginRequiredMixin, UserPassesTestMixin, View):
    def test_func(self):
        return self.request.user.is_staff or self.request.user.is_superuser

    def post(self, request, pk):
        comment = get_object_or_404(Comment, pk=pk)
        comment.delete()
        messages.success(request, '🗑️ ลบความคิดเห็นเรียบร้อยแล้ว')
        return redirect(request.POST.get('next', '/dashboard/?tab=comments'))

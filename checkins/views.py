from django.shortcuts import get_object_or_404, redirect
from django.urls import reverse_lazy, reverse

from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView, View, TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.contrib import messages
from django.core.exceptions import PermissionDenied
from django.http import JsonResponse
from .models import CheckIn, Like
from .forms import CheckInForm

class FeedView(LoginRequiredMixin, ListView):
    model = CheckIn
    template_name = 'checkins/feed.html'
    context_object_name = 'checkins'
    paginate_by = 10

    def get_queryset(self):
        return CheckIn.objects.select_related('user', 'user__profile').prefetch_related('likes').order_by('-created_at')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        if self.request.user.is_authenticated:
            # Set of check-in IDs liked by current user for fast lookup in template
            user_liked_ids = set(
                Like.objects.filter(
                    user=self.request.user,
                    checkin__in=context['checkins']
                ).values_list('checkin_id', flat=True)
            )
            context['user_liked_ids'] = user_liked_ids
        return context

class CheckInDetailView(LoginRequiredMixin, DetailView):
    model = CheckIn
    template_name = 'checkins/detail.html'
    context_object_name = 'checkin'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        checkin = self.get_object()
        is_liked = False
        if self.request.user.is_authenticated:
            is_liked = checkin.likes.filter(user=self.request.user).exists()
        context['is_liked'] = is_liked
        context['likes_count'] = checkin.likes.count()
        context['is_owner'] = (checkin.user == self.request.user)
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
        return checkin.user == self.request.user

    def handle_no_permission(self):
        if self.request.user.is_authenticated:
            raise PermissionDenied("คุณไม่มีสิทธิ์แก้ไขเช็คอินของผู้อื่น")
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
        return checkin.user == self.request.user

    def handle_no_permission(self):
        if self.request.user.is_authenticated:
            raise PermissionDenied("คุณไม่มีสิทธิ์ลบเช็คอินของผู้อื่น")
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
        # Select all checkins with valid lat/long
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
            # Already liked -> unlike
            like_obj.delete()
            liked = False
        else:
            liked = True

        likes_count = checkin.likes.count()

        if request.headers.get('x-requested-with') == 'XMLHttpRequest' or request.GET.get('format') == 'json':
            return JsonResponse({
                'liked': liked,
                'likes_count': likes_count
            })

        # Regular form fallback
        next_url = request.POST.get('next', reverse('checkins:detail', kwargs={'pk': pk}))
        return redirect(next_url)

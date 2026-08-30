from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse
from django.contrib.auth import login, logout
from django.contrib.auth.views import LoginView
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.models import User
from django.contrib import messages
from django.views.generic import View
from django.utils.decorators import method_decorator
from django.http import JsonResponse

from .forms import SignUpForm, UserUpdateForm, ProfileEditForm
from .models import Profile, Follow
from checkins.models import CheckIn, Bookmark, Like


class SignUpView(View):
    def get(self, request):
        if request.user.is_authenticated:
            return redirect("checkins:feed")
        form = SignUpForm()
        return render(request, "accounts/signup.html", {"form": form})

    def post(self, request):
        if request.user.is_authenticated:
            return redirect("checkins:feed")
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(
                request, f"ยินดีต้อนรับคุณ {user.username}! สมัครสมาชิกสำเร็จเรียบร้อยแล้ว"
            )
            return redirect("checkins:feed")
        else:
            messages.error(request, "กรุณาตรวจสอบข้อมูลที่กรอกและลองใหม่อีกครั้ง")
            return render(request, "accounts/signup.html", {"form": form})


class CustomLoginView(LoginView):
    template_name = "accounts/login.html"
    redirect_authenticated_user = True

    def form_valid(self, form):
        messages.success(self.request, f"ยินดีต้อนรับกลับมา, {form.get_user().username}!")
        return super().form_valid(form)

    def form_invalid(self, form):
        messages.error(self.request, "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง โปรดลองอีกครั้ง")
        return super().form_invalid(form)


class CustomLogoutView(View):
    def post(self, request):
        logout(request)
        messages.info(request, "คุณได้ออกจากระบบเรียบร้อยแล้ว")
        return redirect("accounts:login")

    def get(self, request):
        logout(request)
        messages.info(request, "คุณได้ออกจากระบบเรียบร้อยแล้ว")
        return redirect("accounts:login")


@method_decorator(login_required, name="dispatch")
class ProfileView(View):
    def get(self, request, username=None):
        if username:
            user_obj = get_object_or_404(User, username=username)
        else:
            user_obj = request.user

        profile, _ = Profile.objects.get_or_create(user=user_obj)
        user_checkins = user_obj.checkins.all().order_by("-created_at")

        is_owner = user_obj == request.user
        is_following = False
        if not is_owner and request.user.is_authenticated:
            is_following = Follow.objects.filter(
                follower=request.user, following=user_obj
            ).exists()

        # Bookmarked checkins
        bookmarked_checkins = []
        if is_owner:
            bookmarked_ids = Bookmark.objects.filter(user=request.user).values_list(
                "checkin_id", flat=True
            )
            bookmarked_checkins = CheckIn.objects.filter(
                id__in=bookmarked_ids
            ).order_by("-created_at")

        # Liked checkins
        liked_checkins = []
        if is_owner:
            liked_ids = Like.objects.filter(user=request.user).values_list(
                "checkin_id", flat=True
            )
            liked_checkins = CheckIn.objects.filter(id__in=liked_ids).order_by(
                "-created_at"
            )

        context = {
            "profile_user": user_obj,
            "profile": profile,
            "checkins": user_checkins,
            "checkin_count": user_checkins.count(),
            "followers_count": user_obj.follower_relations.count(),
            "following_count": user_obj.following_relations.count(),
            "is_owner": is_owner,
            "is_following": is_following,
            "bookmarked_checkins": bookmarked_checkins,
            "bookmarked_count": len(bookmarked_checkins),
            "liked_checkins": liked_checkins,
            "liked_count": len(liked_checkins),
        }
        return render(request, "accounts/profile.html", context)


@login_required
def profile_edit(request):
    profile, _ = Profile.objects.get_or_create(user=request.user)
    if request.method == "POST":
        u_form = UserUpdateForm(request.POST, instance=request.user)
        p_form = ProfileEditForm(request.POST, request.FILES, instance=profile)
        if u_form.is_valid() and p_form.is_valid():
            u_form.save()
            p_form.save()
            messages.success(request, "อัปเดตข้อมูลโปรไฟล์เรียบร้อยแล้ว!")
            return redirect("accounts:profile_me")
        else:
            messages.error(request, "เกิดข้อผิดพลาด กรุณาตรวจสอบข้อมูลที่กรอก")
    else:
        u_form = UserUpdateForm(instance=request.user)
        p_form = ProfileEditForm(instance=profile)

    context = {
        "u_form": u_form,
        "p_form": p_form,
    }
    return render(request, "accounts/profile_edit.html", context)


class ToggleFollowView(LoginRequiredMixin, View):
    def post(self, request, username):
        target_user = get_object_or_404(User, username=username)

        if target_user == request.user:
            return JsonResponse(
                {"success": False, "error": "คุณไม่สามารถติดตามตนเองได้"}, status=400
            )

        follow_obj, created = Follow.objects.get_or_create(
            follower=request.user, following=target_user
        )

        if not created:
            follow_obj.delete()
            following = False
        else:
            following = True

        followers_count = target_user.follower_relations.count()
        following_count = target_user.following_relations.count()

        if (
            request.headers.get("x-requested-with") == "XMLHttpRequest"
            or request.GET.get("format") == "json"
        ):
            return JsonResponse(
                {
                    "success": True,
                    "following": following,
                    "followers_count": followers_count,
                    "following_count": following_count,
                    "target_username": target_user.username,
                }
            )

        next_url = request.POST.get(
            "next", reverse("accounts:profile_user", kwargs={"username": username})
        )
        return redirect(next_url)


class UserFollowersListView(LoginRequiredMixin, View):
    def get(self, request, username):
        target_user = get_object_or_404(User, username=username)
        followers = Follow.objects.filter(following=target_user).select_related(
            "follower", "follower__profile"
        )

        user_following_ids = set(
            Follow.objects.filter(follower=request.user).values_list(
                "following_id", flat=True
            )
        )

        data = []
        for f in followers:
            u = f.follower
            data.append(
                {
                    "id": u.id,
                    "username": u.username,
                    "display_name": u.get_full_name() or u.username,
                    "avatar_url": u.get_avatar_url,
                    "is_following": u.id in user_following_ids,
                    "is_self": u == request.user,
                }
            )

        return JsonResponse(
            {
                "success": True,
                "type": "followers",
                "title": f"ผู้ติดตามของ @{target_user.username}",
                "users": data,
            }
        )


class UserFollowingListView(LoginRequiredMixin, View):
    def get(self, request, username):
        target_user = get_object_or_404(User, username=username)
        following_list = Follow.objects.filter(follower=target_user).select_related(
            "following", "following__profile"
        )

        user_following_ids = set(
            Follow.objects.filter(follower=request.user).values_list(
                "following_id", flat=True
            )
        )

        data = []
        for f in following_list:
            u = f.following
            data.append(
                {
                    "id": u.id,
                    "username": u.username,
                    "display_name": u.get_full_name() or u.username,
                    "avatar_url": u.get_avatar_url,
                    "is_following": u.id in user_following_ids,
                    "is_self": u == request.user,
                }
            )

        return JsonResponse(
            {
                "success": True,
                "type": "following",
                "title": f"กำลังติดตามโดย @{target_user.username}",
                "users": data,
            }
        )


class UserSearchView(LoginRequiredMixin, View):
    def get(self, request):
        from django.db.models import Q, Count
        query = request.GET.get('q', '').strip()

        if query:
            users_qs = User.objects.filter(
                Q(username__icontains=query)
                | Q(first_name__icontains=query)
                | Q(last_name__icontains=query)
                | Q(profile__bio__icontains=query)
            ).exclude(id=request.user.id).select_related('profile').annotate(
                num_checkins=Count('checkins', distinct=True),
                num_followers=Count('follower_relations', distinct=True)
            ).order_by('-num_followers', '-num_checkins')[:50]
        else:
            # Suggested users (Active users with checkins, excluding self)
            users_qs = User.objects.exclude(id=request.user.id).select_related('profile').annotate(
                num_checkins=Count('checkins', distinct=True),
                num_followers=Count('follower_relations', distinct=True)
            ).order_by('-num_checkins', '-num_followers', '-date_joined')[:30]

        user_following_ids = set(
            Follow.objects.filter(follower=request.user).values_list('following_id', flat=True)
        )

        if request.headers.get('x-requested-with') == 'XMLHttpRequest' or request.GET.get('format') == 'json':
            users_data = []
            for u in users_qs:
                users_data.append({
                    'id': u.id,
                    'username': u.username,
                    'display_name': u.get_full_name() or u.username,
                    'avatar_url': u.get_avatar_url,
                    'bio': u.profile.bio if hasattr(u, 'profile') else '',
                    'num_checkins': getattr(u, 'num_checkins', 0),
                    'num_followers': getattr(u, 'num_followers', 0),
                    'is_following': u.id in user_following_ids,
                    'profile_url': reverse('accounts:profile_user', kwargs={'username': u.username}),
                })
            return JsonResponse({'success': True, 'users': users_data, 'query': query})

        return render(request, 'accounts/user_search.html', {
            'users': users_qs,
            'query': query,
            'user_following_ids': user_following_ids,
        })

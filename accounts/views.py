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
from django.conf import settings

# pyrefly: ignore [missing-import]
from decouple import config
import urllib.request
import urllib.parse
import json
import uuid

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
            Profile.objects.get_or_create(user=user)
            login(request, user)
            messages.success(
                request, f"ยินดีต้อนรับคุณ @{user.username}! สมัครสมาชิกสำเร็จเรียบร้อยแล้ว"
            )
            return redirect("checkins:feed")
        else:
            messages.error(request, "กรุณาตรวจสอบข้อมูลที่กรอกและลองใหม่อีกครั้ง")
            return render(request, "accounts/signup.html", {"form": form})


class CustomLoginView(LoginView):
    template_name = "accounts/login.html"
    redirect_authenticated_user = True

    def form_valid(self, form):
        messages.success(self.request, f"ยินดีต้อนรับกลับมา, @{form.get_user().username}!")
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

        profile, _ = Profile.objects.select_related("user").get_or_create(user=user_obj)
        user_checkins = user_obj.checkins.select_related("user", "user__profile").order_by("-created_at")

        is_owner = user_obj == request.user
        is_following = False
        if not is_owner and request.user.is_authenticated:
            is_following = Follow.objects.filter(
                follower=request.user, following=user_obj
            ).exists()

        # Bookmarked checkins
        bookmarked_checkins = []
        if is_owner:
            bookmarked_ids = list(Bookmark.objects.filter(user=request.user).values_list(
                "checkin_id", flat=True
            ))
            if bookmarked_ids:
                bookmarked_checkins = CheckIn.objects.filter(
                    id__in=bookmarked_ids
                ).select_related("user", "user__profile").order_by("-created_at")

        # Liked checkins
        liked_checkins = []
        if is_owner:
            liked_ids = list(Like.objects.filter(user=request.user).values_list(
                "checkin_id", flat=True
            ))
            if liked_ids:
                liked_checkins = CheckIn.objects.filter(
                    id__in=liked_ids
                ).select_related("user", "user__profile").order_by("-created_at")

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
            if (
                request.headers.get("x-requested-with") == "XMLHttpRequest"
                or request.GET.get("format") == "json"
            ):
                return JsonResponse(
                    {"success": False, "error": "คุณไม่สามารถติดตามตนเองได้"}, status=400
                )
            messages.warning(request, "คุณไม่สามารถติดตามตนเองได้")
            return redirect("accounts:profile_user", username=username)

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

        query = request.GET.get("q", "").strip()

        if query:
            users_qs = (
                User.objects.filter(
                    Q(username__icontains=query)
                    | Q(first_name__icontains=query)
                    | Q(last_name__icontains=query)
                    | Q(profile__bio__icontains=query)
                )
                .exclude(id=request.user.id)
                .select_related("profile")
                .annotate(
                    num_checkins=Count("checkins", distinct=True),
                    num_followers=Count("follower_relations", distinct=True),
                )
                .order_by("-num_followers", "-num_checkins")[:50]
            )
        else:
            # Suggested users (Active users with checkins, excluding self)
            users_qs = (
                User.objects.exclude(id=request.user.id)
                .select_related("profile")
                .annotate(
                    num_checkins=Count("checkins", distinct=True),
                    num_followers=Count("follower_relations", distinct=True),
                )
                .order_by("-num_checkins", "-num_followers", "-date_joined")[:30]
            )

        user_following_ids = set(
            Follow.objects.filter(follower=request.user).values_list(
                "following_id", flat=True
            )
        )

        if (
            request.headers.get("x-requested-with") == "XMLHttpRequest"
            or request.GET.get("format") == "json"
        ):
            users_data = []
            for u in users_qs:
                users_data.append(
                    {
                        "id": u.id,
                        "username": u.username,
                        "display_name": u.get_full_name() or u.username,
                        "avatar_url": u.get_avatar_url,
                        "bio": u.profile.bio if hasattr(u, "profile") else "",
                        "num_checkins": getattr(u, "num_checkins", 0),
                        "num_followers": getattr(u, "num_followers", 0),
                        "is_following": u.id in user_following_ids,
                        "profile_url": reverse(
                            "accounts:profile_user", kwargs={"username": u.username}
                        ),
                    }
                )
            return JsonResponse({"success": True, "users": users_data, "query": query})

        return render(
            request,
            "accounts/user_search.html",
            {
                "users": users_qs,
                "query": query,
                "user_following_ids": user_following_ids,
            },
        )


# =========================================================================
# OAUTH SOCIAL LOGIN (GOOGLE & GITHUB) + AVATAR EXTRACTION
# =========================================================================


def _download_and_save_avatar(profile, avatar_url, username):
    """Download avatar from OAuth provider and save to user's Profile via Cloudinary."""
    if not avatar_url:
        return
    try:
        # pyrefly: ignore [missing-import]
        import cloudinary.uploader

        upload_result = cloudinary.uploader.upload(
            avatar_url,
            folder="avatars",
            public_id=f"avatar_{username}_{uuid.uuid4().hex[:6]}",
            overwrite=True,
        )
        if upload_result and "public_id" in upload_result:
            profile.avatar = upload_result["public_id"]
            profile.save(update_fields=["avatar"])
            return
    except Exception as e:
        print(f"Cloudinary direct upload note: {e}")

    try:
        from django.core.files.uploadedfile import SimpleUploadedFile

        req = urllib.request.Request(avatar_url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=5) as response:
            image_data = response.read()
            if image_data:
                profile.avatar = SimpleUploadedFile(
                    name=f"oauth_{username}_{uuid.uuid4().hex[:6]}.jpg",
                    content=image_data,
                    content_type="image/jpeg",
                )
                profile.save()
    except Exception as e:
        print(f"Error saving OAuth avatar for {username}: {e}")


class GoogleOAuthLoginView(View):
    def get(self, request):
        client_id = config("GOOGLE_OAUTH_CLIENT_ID", default="").strip()
        redirect_uri = request.build_absolute_uri(reverse("accounts:google_callback"))

        if not client_id:
            messages.warning(
                request,
                "ระบบ Google Login อยู่ในระหว่างการเชื่อมต่อ API Credential กรุณาใช้เข้าสู่ระบบด้วย GitHub หรือสมัครสมาชิกด้วยชื่อผู้ใช้",
            )
            return redirect("accounts:signup")

        params = {
            "client_id": client_id,
            "redirect_uri": redirect_uri,
            "response_type": "code",
            "scope": "openid email profile",
            "access_type": "online",
            "prompt": "select_account",
        }
        auth_url = f"https://accounts.google.com/o/oauth2/v2/auth?{urllib.parse.urlencode(params)}"
        return redirect(auth_url)


class GoogleOAuthCallbackView(View):
    def get(self, request):
        code = request.GET.get("code")
        error = request.GET.get("error")

        if error or not code:
            messages.error(request, "การเข้าสู่ระบบด้วย Google ถูกยกเลิกหรือเกิดข้อผิดพลาด")
            return redirect("accounts:login")

        client_id = config("GOOGLE_OAUTH_CLIENT_ID", default="").strip()
        client_secret = config("GOOGLE_OAUTH_CLIENT_SECRET", default="").strip()
        redirect_uri = request.build_absolute_uri(reverse("accounts:google_callback"))

        try:
            # Exchange code for access token
            token_url = "https://oauth2.googleapis.com/token"
            token_data = urllib.parse.urlencode(
                {
                    "code": code,
                    "client_id": client_id,
                    "client_secret": client_secret,
                    "redirect_uri": redirect_uri,
                    "grant_type": "authorization_code",
                }
            ).encode("utf-8")

            token_req = urllib.request.Request(
                token_url, data=token_data, method="POST"
            )
            with urllib.request.urlopen(token_req, timeout=10) as resp:
                token_json = json.loads(resp.read().decode())

            access_token = token_json.get("access_token")
            if not access_token:
                raise ValueError("No access token returned from Google")

            # Fetch user info
            userinfo_req = urllib.request.Request(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                headers={"Authorization": f"Bearer {access_token}"},
            )
            with urllib.request.urlopen(userinfo_req, timeout=10) as resp:
                userinfo = json.loads(resp.read().decode())

            email = userinfo.get("email", "")
            first_name = userinfo.get("given_name", "")
            last_name = userinfo.get("family_name", "")
            picture = userinfo.get("picture", "")
            google_id = userinfo.get("id", "")

            username_base = email.split("@")[0] if email else f"g_user_{google_id[:6]}"
            username = username_base.lower()

            user = None
            if email:
                user = User.objects.filter(email=email).first()
            if not user:
                user = User.objects.filter(username=username).first()

            if not user:
                # Generate unique username if taken
                final_username = username
                counter = 1
                while User.objects.filter(username=final_username).exists():
                    final_username = f"{username}{counter}"
                    counter += 1

                user = User.objects.create_user(
                    username=final_username,
                    email=email,
                    first_name=first_name,
                    last_name=last_name,
                )
                user.set_unusable_password()
                user.save()

            profile, _ = Profile.objects.get_or_create(user=user)
            if picture and not profile.avatar:
                _download_and_save_avatar(profile, picture, user.username)

            login(request, user)
            messages.success(
                request, f"🎉 เข้าสู่ระบบผ่าน Google สำเร็จ! ยินดีต้อนรับ @{user.username}"
            )
            return redirect("checkins:feed")

        except Exception as e:
            messages.error(request, f"เกิดข้อผิดพลาดในการเชื่อมต่อ Google: {str(e)}")
            return redirect("accounts:login")


class GitHubOAuthLoginView(View):
    def get(self, request):
        client_id = config(
            "GITHUB_OAUTH_CLIENT_ID", default="Ov23li3OtJ9Wu3gxaQBU"
        ).strip()
        redirect_uri = request.build_absolute_uri(reverse("accounts:github_callback"))

        if not client_id:
            messages.warning(
                request,
                "ระบบ GitHub Login อยู่ในระหว่างการเชื่อมต่อ API Credential กรุณาใช้การสมัครสมาชิกด้วยชื่อผู้ใช้ หรือติดต่อผู้ดูแลระบบ",
            )
            return redirect("accounts:signup")

        params = {
            "client_id": client_id,
            "redirect_uri": redirect_uri,
            "scope": "read:user user:email",
        }
        auth_url = (
            f"https://github.com/login/oauth/authorize?{urllib.parse.urlencode(params)}"
        )
        return redirect(auth_url)


class GitHubOAuthCallbackView(View):
    def get(self, request):
        code = request.GET.get("code")
        error = request.GET.get("error")

        if error or not code:
            messages.error(request, "การเข้าสู่ระบบด้วย GitHub ถูกยกเลิกหรือเกิดข้อผิดพลาด")
            return redirect("accounts:login")

        client_id = config(
            "GITHUB_OAUTH_CLIENT_ID", default="Ov23li3OtJ9Wu3gxaQBU"
        ).strip()
        client_secret = config(
            "GITHUB_OAUTH_CLIENT_SECRET",
            default="86ca2c3e2128f82e41a8362cbb86f6f0a92659a0",
        ).strip()
        redirect_uri = request.build_absolute_uri(reverse("accounts:github_callback"))

        try:
            # Exchange code for access token
            token_url = "https://github.com/login/oauth/access_token"
            token_data = urllib.parse.urlencode(
                {
                    "code": code,
                    "client_id": client_id,
                    "client_secret": client_secret,
                    "redirect_uri": redirect_uri,
                }
            ).encode("utf-8")

            token_req = urllib.request.Request(
                token_url,
                data=token_data,
                headers={"Accept": "application/json"},
                method="POST",
            )
            with urllib.request.urlopen(token_req, timeout=10) as resp:
                token_json = json.loads(resp.read().decode())

            access_token = token_json.get("access_token")
            if not access_token:
                raise ValueError("No access token returned from GitHub")

            # Fetch GitHub user profile
            user_req = urllib.request.Request(
                "https://api.github.com/user",
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "User-Agent": "Thi-Ni-Checkin-App",
                },
            )
            with urllib.request.urlopen(user_req, timeout=10) as resp:
                gh_user = json.loads(resp.read().decode())

            gh_login = gh_user.get("login", "")
            gh_name = gh_user.get("name", "") or gh_login
            gh_avatar_url = gh_user.get("avatar_url", "")
            gh_email = gh_user.get("email", "") or ""

            username = gh_login.lower()
            user = User.objects.filter(username=username).first()

            if not user and gh_email:
                user = User.objects.filter(email=gh_email).first()

            if not user:
                final_username = username
                counter = 1
                while User.objects.filter(username=final_username).exists():
                    final_username = f"{username}{counter}"
                    counter += 1

                user = User.objects.create_user(
                    username=final_username,
                    email=gh_email,
                    first_name=gh_name,
                )
                user.set_unusable_password()
                user.save()

            profile, _ = Profile.objects.get_or_create(user=user)
            if gh_avatar_url and not profile.avatar:
                _download_and_save_avatar(profile, gh_avatar_url, user.username)

            login(request, user)
            messages.success(
                request, f"🎉 เข้าสู่ระบบผ่าน GitHub สำเร็จ! ยินดีต้อนรับ @{user.username}"
            )
            return redirect("checkins:feed")

        except Exception as e:
            messages.error(request, f"เกิดข้อผิดพลาดในการเชื่อมต่อ GitHub: {str(e)}")
            return redirect("accounts:login")

from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout
from django.contrib.auth.views import LoginView, LogoutView
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib import messages
from django.views.generic import View, DetailView
from django.utils.decorators import method_decorator
from .forms import SignUpForm, UserUpdateForm, ProfileEditForm
from .models import Profile

class SignUpView(View):
    def get(self, request):
        if request.user.is_authenticated:
            return redirect('checkins:feed')
        form = SignUpForm()
        return render(request, 'accounts/signup.html', {'form': form})

    def post(self, request):
        if request.user.is_authenticated:
            return redirect('checkins:feed')
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, f'ยินดีต้อนรับคุณ {user.username}! สมัครสมาชิกสำเร็จเรียบร้อยแล้ว')
            return redirect('checkins:feed')
        else:
            messages.error(request, 'กรุณาตรวจสอบข้อมูลที่กรอกและลองใหม่อีกครั้ง')
            return render(request, 'accounts/signup.html', {'form': form})

class CustomLoginView(LoginView):
    template_name = 'accounts/login.html'
    redirect_authenticated_user = True

    def form_valid(self, form):
        messages.success(self.request, f'ยินดีต้อนรับกลับมา, {form.get_user().username}!')
        return super().form_valid(form)

    def form_invalid(self, form):
        messages.error(self.request, 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง โปรดลองอีกครั้ง')
        return super().form_invalid(form)

class CustomLogoutView(View):
    def post(self, request):
        logout(request)
        messages.info(request, 'คุณได้ออกจากระบบเรียบร้อยแล้ว')
        return redirect('accounts:login')

    def get(self, request):
        logout(request)
        messages.info(request, 'คุณได้ออกจากระบบเรียบร้อยแล้ว')
        return redirect('accounts:login')

@method_decorator(login_required, name='dispatch')
class ProfileView(View):
    def get(self, request, username=None):
        if username:
            user_obj = get_object_or_404(User, username=username)
        else:
            user_obj = request.user

        profile, _ = Profile.objects.get_or_create(user=user_obj)
        user_checkins = user_obj.checkins.all().order_by('-created_at')

        context = {
            'profile_user': user_obj,
            'profile': profile,
            'checkins': user_checkins,
            'checkin_count': user_checkins.count(),
            'is_owner': (user_obj == request.user),
        }
        return render(request, 'accounts/profile.html', context)

@login_required
def profile_edit(request):
    profile, _ = Profile.objects.get_or_create(user=request.user)
    if request.method == 'POST':
        u_form = UserUpdateForm(request.POST, instance=request.user)
        p_form = ProfileEditForm(request.POST, request.FILES, instance=profile)
        if u_form.is_valid() and p_form.is_valid():
            u_form.save()
            p_form.save()
            messages.success(request, 'อัปเดตข้อมูลโปรไฟล์เรียบร้อยแล้ว!')
            return redirect('accounts:profile_me')
        else:
            messages.error(request, 'เกิดข้อผิดพลาด กรุณาตรวจสอบข้อมูลที่กรอก')
    else:
        u_form = UserUpdateForm(instance=request.user)
        p_form = ProfileEditForm(instance=profile)

    context = {
        'u_form': u_form,
        'p_form': p_form,
    }
    return render(request, 'accounts/profile_edit.html', context)

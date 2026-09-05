import logging
from datetime import timedelta
from django.conf import settings
from django.contrib import messages
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.shortcuts import render, redirect
from django.template.loader import render_to_string
from django.utils import timezone
from django.utils.html import strip_tags
from django.views import View

from .forms import (
    PasswordResetRequestForm,
    PasswordResetVerifyOTPForm,
    SetNewPasswordForm,
)
from .models import PasswordResetOTP

logger = logging.getLogger(__name__)


def _mask_email(email):
    """Mask email for display: mpoontv1234@gmail.com -> mp***34@gmail.com"""
    if not email or "@" not in email:
        return email
    user_part, domain_part = email.split("@", 1)
    if len(user_part) <= 3:
        masked_user = user_part[0] + "***"
    else:
        masked_user = user_part[:2] + "***" + user_part[-2:]
    return f"{masked_user}@{domain_part}"


class PasswordResetRequestView(View):
    """Step 1: Request OTP by providing account email."""
    template_name = "accounts/password_reset_request.html"

    def get(self, request):
        form = PasswordResetRequestForm()
        return render(request, self.template_name, {"form": form})

    def post(self, request):
        form = PasswordResetRequestForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data["email"]
            user = User.objects.filter(email__iexact=email).first()
            if user:
                otp = PasswordResetOTP.generate_otp_for_user(user, email)
                
                # Send email
                subject = "📍 [ที่นี่ Check-in] รหัส OTP สำหรับรีเซ็ตรหัสผ่านของคุณ"
                context = {
                    "user": user,
                    "otp_code": otp.otp_code,
                    "valid_minutes": 10,
                }
                html_message = render_to_string("emails/password_reset_otp.html", context)
                plain_message = strip_tags(html_message)
                
                try:
                    send_mail(
                        subject=subject,
                        message=plain_message,
                        from_email=getattr(settings, "DEFAULT_FROM_EMAIL", None),
                        recipient_list=[email],
                        html_message=html_message,
                        fail_silently=False,
                    )
                    logger.info(f"Password reset OTP sent to {email}")
                except Exception as e:
                    logger.exception(f"Failed to send password reset email to {email}: {e}")
                    print(f"❌ [EMAIL SEND ERROR] Failed to send email to {email}: {e}")
                    err_detail = f" ({e})" if getattr(settings, "DEBUG", False) else ""
                    messages.error(
                        request,
                        f"เกิดข้อผิดพลาดในการส่งอีเมล{err_detail} กรุณาลองใหม่อีกครั้งในภายหลัง หรือติดต่อผู้ดูแลระบบ",
                    )
                    return render(request, self.template_name, {"form": form})

                # Save state in session
                request.session["pwd_reset_user_id"] = user.id
                request.session["pwd_reset_email"] = email
                request.session["pwd_reset_last_sent"] = timezone.now().isoformat()
                request.session["pwd_reset_verified"] = False

                messages.success(
                    request,
                    f"ส่งรหัส OTP 6 หลักไปยังอีเมล {_mask_email(email)} เรียบร้อยแล้ว (รหัสมีอายุ 10 นาที)",
                )
                return redirect("accounts:password_reset_verify")

        return render(request, self.template_name, {"form": form})


class PasswordResetVerifyView(View):
    """Step 2: Enter and verify 6-digit OTP."""
    template_name = "accounts/password_reset_verify.html"

    def get(self, request):
        user_id = request.session.get("pwd_reset_user_id")
        email = request.session.get("pwd_reset_email")
        if not user_id or not email:
            messages.warning(request, "กรุณากรอกอีเมลเพื่อขอรับรหัส OTP ก่อน")
            return redirect("accounts:password_reset_request")

        form = PasswordResetVerifyOTPForm()
        return render(
            request,
            self.template_name,
            {"form": form, "masked_email": _mask_email(email)},
        )

    def post(self, request):
        user_id = request.session.get("pwd_reset_user_id")
        email = request.session.get("pwd_reset_email")
        if not user_id or not email:
            messages.warning(request, "เซสชันหมดอายุ กรุณากรอกอีเมลใหม่")
            return redirect("accounts:password_reset_request")

        form = PasswordResetVerifyOTPForm(request.POST)
        if form.is_valid():
            otp_code = form.cleaned_data["otp_code"]
            
            # Find latest unused OTP
            otp = (
                PasswordResetOTP.objects.filter(user_id=user_id, is_used=False)
                .order_by("-created_at")
                .first()
            )

            if not otp or timezone.now() > otp.expires_at:
                form.add_error("otp_code", "รหัส OTP นี้หมดอายุแล้ว กรุณากดขอรหัส OTP ใหม่")
            elif otp.attempts >= 5:
                form.add_error(
                    "otp_code",
                    "คุณกรอกรหัสผิดเกิน 5 ครั้งแล้วเพื่อความปลอดภัย กรุณากดขอรหัส OTP ใหม่",
                )
            elif otp.otp_code != otp_code:
                otp.attempts += 1
                otp.save(update_fields=["attempts"])
                remaining = max(0, 5 - otp.attempts)
                form.add_error(
                    "otp_code",
                    f"รหัส OTP ไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง (เหลือโอกาสลองอีก {remaining} ครั้ง)",
                )
            else:
                # Success
                otp.is_used = True
                otp.save(update_fields=["is_used"])
                request.session["pwd_reset_verified"] = True
                messages.success(request, "ยืนยันรหัส OTP ถูกต้อง! กรุณาตั้งรหัสผ่านใหม่ด้านล่าง")
                return redirect("accounts:password_reset_confirm")

        return render(
            request,
            self.template_name,
            {"form": form, "masked_email": _mask_email(email)},
        )


class PasswordResetResendView(View):
    """Resend OTP to the email stored in session."""

    def post(self, request):
        user_id = request.session.get("pwd_reset_user_id")
        email = request.session.get("pwd_reset_email")
        if not user_id or not email:
            messages.warning(request, "กรุณากรอกอีเมลเพื่อขอรับรหัส OTP ก่อน")
            return redirect("accounts:password_reset_request")

        user = User.objects.filter(id=user_id).first()
        if not user:
            return redirect("accounts:password_reset_request")

        # Cooldown check (60 seconds)
        last_sent_str = request.session.get("pwd_reset_last_sent")
        if last_sent_str:
            try:
                last_sent = timezone.datetime.fromisoformat(last_sent_str)
                if timezone.now() - last_sent < timedelta(seconds=60):
                    wait_sec = int(60 - (timezone.now() - last_sent).total_seconds())
                    messages.warning(
                        request,
                        f"กรุณารออีก {wait_sec} วินาทีก่อนกดขอรหัส OTP ใหม่",
                    )
                    return redirect("accounts:password_reset_verify")
            except Exception:
                pass

        otp = PasswordResetOTP.generate_otp_for_user(user, email)
        subject = "📍 [ที่นี่ Check-in] รหัส OTP ใหม่สำหรับรีเซ็ตรหัสผ่านของคุณ"
        context = {
            "user": user,
            "otp_code": otp.otp_code,
            "valid_minutes": 10,
        }
        html_message = render_to_string("emails/password_reset_otp.html", context)
        plain_message = strip_tags(html_message)

        try:
            send_mail(
                subject=subject,
                message=plain_message,
                from_email=getattr(settings, "DEFAULT_FROM_EMAIL", None),
                recipient_list=[email],
                html_message=html_message,
                fail_silently=False,
            )
            request.session["pwd_reset_last_sent"] = timezone.now().isoformat()
            messages.success(
                request,
                f"ส่งรหัส OTP ใหม่ไปยัง {_mask_email(email)} เรียบร้อยแล้ว",
            )
        except Exception as e:
            logger.exception(f"Failed to resend OTP to {email}: {e}")
            print(f"❌ [EMAIL RESEND ERROR] Failed to resend to {email}: {e}")
            err_detail = f" ({e})" if getattr(settings, "DEBUG", False) else ""
            messages.error(request, f"ส่งอีเมลไม่สำเร็จ{err_detail} กรุณาลองใหม่อีกครั้ง")

        return redirect("accounts:password_reset_verify")


class PasswordResetConfirmView(View):
    """Step 3: Set new password after successful OTP verification."""
    template_name = "accounts/password_reset_confirm.html"

    def get(self, request):
        user_id = request.session.get("pwd_reset_user_id")
        verified = request.session.get("pwd_reset_verified")
        if not user_id or not verified:
            messages.warning(request, "กรุณายืนยันรหัส OTP ก่อนตั้งรหัสผ่านใหม่")
            return redirect("accounts:password_reset_request")

        form = SetNewPasswordForm()
        return render(request, self.template_name, {"form": form})

    def post(self, request):
        user_id = request.session.get("pwd_reset_user_id")
        verified = request.session.get("pwd_reset_verified")
        if not user_id or not verified:
            messages.warning(request, "เซสชันหมดอายุ กรุณาเริ่มกระบวนการใหม่อีกครั้ง")
            return redirect("accounts:password_reset_request")

        form = SetNewPasswordForm(request.POST)
        if form.is_valid():
            user = User.objects.filter(id=user_id).first()
            if not user:
                messages.error(request, "ไม่พบผู้ใช้ในระบบ")
                return redirect("accounts:login")

            new_password = form.cleaned_data["new_password"]
            user.set_password(new_password)
            user.save()

            # Clean up session
            request.session.pop("pwd_reset_user_id", None)
            request.session.pop("pwd_reset_email", None)
            request.session.pop("pwd_reset_verified", None)
            request.session.pop("pwd_reset_last_sent", None)

            messages.success(
                request,
                "🎉 ตั้งรหัสผ่านใหม่สำเร็จเรียบร้อย! สามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้ทันที",
            )
            return redirect("accounts:login")

        return render(request, self.template_name, {"form": form})

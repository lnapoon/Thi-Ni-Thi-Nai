from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from .models import Profile


class SignUpForm(UserCreationForm):
    email = forms.EmailField(
        required=True,
        error_messages={
            "required": "กรุณากรอกอีเมล",
            "invalid": "กรุณากรอกรูปแบบอีเมลให้ถูกต้อง",
        },
        widget=forms.EmailInput(
            attrs={
                "class": "form-control rounded-pill px-3 py-2",
                "placeholder": "ใส่อีเมลของคุณ (Email)",
            }
        ),
    )
    agree_pdpa = forms.BooleanField(
        required=True,
        error_messages={
            "required": "กรุณายินยอมรับข้อกำหนดและนโยบายคุ้มครองข้อมูลส่วนบุคคล (PDPA) เพื่อดำเนินการต่อ"
        },
        widget=forms.CheckboxInput(attrs={"class": "form-check-input"}),
    )

    class Meta(UserCreationForm.Meta):
        model = User
        fields = ("username", "email")

    def clean_email(self):
        email = self.cleaned_data.get("email", "").strip().lower()
        if email and User.objects.filter(email__iexact=email).exists():
            raise forms.ValidationError("อีเมลนี้ถูกใช้งานไปแล้ว กรุณาใช้อีเมลอื่น")
        return email

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["username"].widget.attrs.update(
            {
                "class": "form-control rounded-pill px-3 py-2",
                "placeholder": "ตั้งชื่อผู้ใช้ (Username)",
            }
        )
        self.fields["email"].widget.attrs.update(
            {
                "class": "form-control rounded-pill px-3 py-2",
                "placeholder": "ใส่อีเมลของคุณ (Email)",
            }
        )
        self.fields["password1"].widget.attrs.update(
            {"class": "form-control rounded-pill px-3 py-2", "placeholder": "ตั้งรหัสผ่าน"}
        )
        self.fields["password2"].widget.attrs.update(
            {
                "class": "form-control rounded-pill px-3 py-2",
                "placeholder": "ยืนยันรหัสผ่านอีกครั้ง",
            }
        )


class UserUpdateForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ["first_name", "last_name", "email"]
        labels = {
            "first_name": "ชื่อ",
            "last_name": "นามสกุล",
            "email": "อีเมล",
        }
        widgets = {
            "first_name": forms.TextInput(
                attrs={"class": "form-control rounded-pill px-3", "placeholder": "ระบุชื่อจริง"}
            ),
            "last_name": forms.TextInput(
                attrs={
                    "class": "form-control rounded-pill px-3",
                    "placeholder": "ระบุนามสกุล",
                }
            ),
            "email": forms.EmailInput(
                attrs={"class": "form-control rounded-pill px-3", "placeholder": "ระบุอีเมลของคุณ"}
            ),
        }


class ProfileEditForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = [
            "avatar",
            "display_name",
            "category",
            "bio",
        ]
        labels = {
            "display_name": "ชื่อที่แสดง",
            "category": "หมวดหมู่ / สถานะ",
            "bio": "ข้อความแนะนำตัว",
            "avatar": "รูปภาพโปรไฟล์",
        }
        widgets = {
            "display_name": forms.TextInput(
                attrs={
                    "class": "form-control rounded-pill px-3",
                    "placeholder": "ระบุชื่อที่ต้องการให้แสดงบนโปรไฟล์",
                }
            ),
            "category": forms.TextInput(
                attrs={
                    "class": "form-control rounded-pill px-3",
                    "placeholder": "ระบุหมวดหมู่หรือสถานะ เช่น นักเดินทาง, สายท่องเที่ยว",
                }
            ),
            "bio": forms.Textarea(
                attrs={
                    "class": "form-control rounded-4 p-3",
                    "rows": 3,
                    "placeholder": "เขียนแนะนำตัว หรือเล่าเรื่องราวเกี่ยวกับตัวคุณสั้นๆ...",
                }
            ),
            "avatar": forms.FileInput(
                attrs={
                    "class": "form-control rounded-pill",
                    "accept": "image/jpeg,image/png,image/webp",
                }
            ),
        }

    def clean_avatar(self):
        avatar = self.cleaned_data.get("avatar")
        if avatar and hasattr(avatar, "size"):
            # Max 5MB
            if avatar.size > 5 * 1024 * 1024:
                raise forms.ValidationError("ขนาดรูปโปรไฟล์ต้องไม่เกิน 5 MB")
        return avatar


class PasswordResetRequestForm(forms.Form):
    email = forms.EmailField(
        label="อีเมลของคุณ",
        required=True,
        error_messages={
            "required": "กรุณากรอกอีเมลที่ใช้สมัครบัญชี",
            "invalid": "กรุณากรอกรูปแบบอีเมลให้ถูกต้อง",
        },
        widget=forms.EmailInput(
            attrs={
                "class": "form-control rounded-pill px-3 py-2",
                "placeholder": "ระบุอีเมลที่ใช้สมัครบัญชี (เช่น name@example.com)",
                "autocomplete": "email",
            }
        ),
    )

    def clean_email(self):
        email = self.cleaned_data.get("email", "").strip().lower()
        if not User.objects.filter(email__iexact=email).exists():
            raise forms.ValidationError("ไม่พบบัญชีผู้ใช้ที่ลงทะเบียนด้วยอีเมลนี้ในระบบ กรุณาตรวจสอบอีกครั้ง")
        return email


class PasswordResetVerifyOTPForm(forms.Form):
    otp_code = forms.CharField(
        label="รหัส OTP 6 หลัก",
        max_length=6,
        min_length=6,
        required=True,
        error_messages={
            "required": "กรุณากรอกรหัส OTP 6 หลัก",
            "min_length": "รหัส OTP ต้องมีตัวเลข 6 หลัก",
            "max_length": "รหัส OTP ต้องมีตัวเลข 6 หลัก",
        },
        widget=forms.TextInput(
            attrs={
                "class": "form-control text-center fw-bold fs-3 rounded-pill py-2 tracking-widest",
                "placeholder": "••••••",
                "maxlength": "6",
                "inputmode": "numeric",
                "pattern": "[0-9]*",
                "autocomplete": "one-time-code",
                "style": "letter-spacing: 0.4em;",
            }
        ),
    )

    def clean_otp_code(self):
        code = self.cleaned_data.get("otp_code", "").strip()
        if not code.isdigit():
            raise forms.ValidationError("รหัส OTP ต้องประกอบด้วยตัวเลข 0-9 เท่านั้น")
        return code


class SetNewPasswordForm(forms.Form):
    new_password = forms.CharField(
        label="รหัสผ่านใหม่",
        widget=forms.PasswordInput(
            attrs={
                "class": "form-control rounded-pill px-3 py-2",
                "placeholder": "ตั้งรหัสผ่านใหม่อย่างน้อย 6 ตัวอักษร",
                "autocomplete": "new-password",
            }
        ),
        min_length=6,
        error_messages={
            "required": "กรุณากรอกรหัสผ่านใหม่",
            "min_length": "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร",
        },
    )
    confirm_password = forms.CharField(
        label="ยืนยันรหัสผ่านใหม่อีกครั้ง",
        widget=forms.PasswordInput(
            attrs={
                "class": "form-control rounded-pill px-3 py-2",
                "placeholder": "พิมพ์รหัสผ่านใหม่อีกครั้งให้ตรงกัน",
                "autocomplete": "new-password",
            }
        ),
        min_length=6,
        error_messages={
            "required": "กรุณายืนยันรหัสผ่านใหม่",
            "min_length": "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร",
        },
    )

    def clean(self):
        cleaned_data = super().clean()
        pw1 = cleaned_data.get("new_password")
        pw2 = cleaned_data.get("confirm_password")
        if pw1 and pw2 and pw1 != pw2:
            self.add_error("confirm_password", "รหัสผ่านทั้งสองช่องไม่ตรงกัน กรุณากรอกใหม่อีกครั้ง")
        return cleaned_data

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
                attrs={"class": "form-control rounded-pill px-3", "placeholder": "ชื่อ"}
            ),
            "last_name": forms.TextInput(
                attrs={
                    "class": "form-control rounded-pill px-3",
                    "placeholder": "นามสกุล",
                }
            ),
            "email": forms.EmailInput(
                attrs={"class": "form-control rounded-pill px-3", "placeholder": "อีเมล"}
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
                    "placeholder": "ชื่อที่แสดง (เช่น ปูนเองก็เหนื่อย🫠)",
                }
            ),
            "category": forms.TextInput(
                attrs={
                    "class": "form-control rounded-pill px-3",
                    "placeholder": "หมวดหมู่ / สถานะ (เช่น นักเดินทาง, สายคาเฟ่)",
                }
            ),
            "bio": forms.Textarea(
                attrs={
                    "class": "form-control rounded-4 p-3",
                    "rows": 3,
                    "placeholder": "คำอธิบายโปรไฟล์ (Bio)",
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

from django.db import models
from django.contrib.auth.models import User

# pyrefly: ignore [missing-import]
from cloudinary.models import CloudinaryField


def user_avatar_path(instance, filename):
    return f"avatars/user_{instance.user.id}/{filename}"


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    avatar = CloudinaryField("image", folder="avatars", null=True, blank=True)
    display_name = models.CharField(max_length=100, blank=True, default="", verbose_name="ชื่อที่แสดง (Display Name)")
    category = models.CharField(max_length=100, blank=True, default="", verbose_name="หมวดหมู่ / MBTI / สถานะ")
    bio = models.TextField(max_length=300, blank=True, default="", verbose_name="คำอธิบายโปรไฟล์ (Bio)")
    website_title = models.CharField(max_length=100, blank=True, default="", verbose_name="ชื่อลิงก์โปรไฟล์/โซเชียล")
    website_url = models.URLField(max_length=300, blank=True, default="", verbose_name="URL ลิงก์โปรไฟล์/โซเชียล")
    music_title = models.CharField(max_length=100, blank=True, default="", verbose_name="เพลงโปรด / แท็กเสียง")
    music_url = models.URLField(max_length=300, blank=True, default="", verbose_name="URL เพลงโปรด")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def get_display_name(self):
        if self.display_name:
            return self.display_name
        if self.user.first_name:
            return f"{self.user.first_name} {self.user.last_name}".strip()
        return self.user.username

    @property
    def get_avatar_url(self):
        """Return optimized CDN URL for the avatar (auto WebP, auto quality, 200x200 crop with face detection)."""
        if not self.avatar:
            return ""
        try:
            url = self.avatar.url
            if url:
                if "/image/upload/" in url and "/image/upload/f_auto" not in url:
                    url = url.replace("/image/upload/", "/image/upload/f_auto,q_auto:good,w_200,h_200,c_fill,g_face/")
                return url
        except Exception:
            pass
        val = str(self.avatar)
        if val.startswith("http"):
            if "/image/upload/" in val and "/image/upload/f_auto" not in val:
                return val.replace("/image/upload/", "/image/upload/f_auto,q_auto:good,w_200,h_200,c_fill,g_face/")
            return val
        from django.conf import settings

        cloud = getattr(settings, "CLOUDINARY_CLOUD_NAME", "pkxxxmpn")
        return f"https://res.cloudinary.com/{cloud}/image/upload/f_auto,q_auto:good,w_200,h_200,c_fill,g_face/{val}"

    @property
    def followers_count(self):
        return self.user.follower_relations.count()

    @property
    def following_count(self):
        return self.user.following_relations.count()

    def __str__(self):
        return f"โปรไฟล์ของ {self.user.username}"

    def save(self, *args, **kwargs):
        # Avatar optimization: resize to 400x400 before upload
        if (
            self.avatar
            and hasattr(self.avatar, "file")
            and not getattr(self, "_avatar_optimized", False)
        ):
            try:
                from PIL import Image, ImageOps
                import io
                from django.core.files.uploadedfile import SimpleUploadedFile

                img = Image.open(self.avatar)
                img = ImageOps.exif_transpose(img)
                img = img.convert("RGB")
                img.thumbnail((400, 400), Image.Resampling.LANCZOS)

                output = io.BytesIO()
                img.save(output, format="JPEG", quality=85, optimize=True)
                output.seek(0)

                self.avatar = SimpleUploadedFile(
                    name=(
                        self.avatar.name
                        if hasattr(self.avatar, "name")
                        else "avatar.jpg"
                    ),
                    content=output.read(),
                    content_type="image/jpeg",
                )
                self._avatar_optimized = True
            except Exception:
                pass

        super().save(*args, **kwargs)


class Follow(models.Model):
    follower = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="following_relations",
        verbose_name="ผู้ติดตาม",
    )
    following = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="follower_relations",
        verbose_name="กำลังติดตาม",
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="ติดตามเมื่อ")

    class Meta:
        unique_together = ("follower", "following")
        ordering = ["-created_at"]
        verbose_name = "การติดตาม"
        verbose_name_plural = "การติดตามทั้งหมด"

    def __str__(self):
        return f"{self.follower.username} ติดตาม {self.following.username}"


def _user_get_avatar_url(user):
    try:
        if hasattr(user, "profile") and user.profile:
            return user.profile.get_avatar_url
    except Exception:
        pass
    return ""


def _user_is_following(user, target_user):
    if not user.is_authenticated or not target_user:
        return False
    return Follow.objects.filter(follower=user, following=target_user).exists()


User.add_to_class("get_avatar_url", property(_user_get_avatar_url))
User.add_to_class("is_following", _user_is_following)


class PasswordResetOTP(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="password_reset_otps",
        verbose_name="ผู้ใช้งาน",
    )
    email = models.EmailField(verbose_name="อีเมลที่รับ OTP")
    otp_code = models.CharField(max_length=6, verbose_name="รหัส OTP 6 หลัก")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="เวลาที่สร้าง")
    expires_at = models.DateTimeField(verbose_name="เวลาหมดอายุ")
    is_used = models.BooleanField(default=False, verbose_name="ถูกใช้งานแล้วหรือไม่")
    attempts = models.PositiveIntegerField(default=0, verbose_name="จำนวนครั้งที่ลองกรอก")

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "OTP รีเซ็ตรหัสผ่าน"
        verbose_name_plural = "OTP รีเซ็ตรหัสผ่านทั้งหมด"

    def __str__(self):
        return f"OTP for {self.user.username} ({self.otp_code})"

    @classmethod
    def generate_otp_for_user(cls, user, email):
        import secrets
        from datetime import timedelta
        from django.utils import timezone

        # Invalidate previous unused OTPs for this user
        cls.objects.filter(user=user, is_used=False).update(is_used=True)
        # Generate 6-digit numeric OTP cryptographically
        code = f"{secrets.randbelow(900000) + 100000}"
        now = timezone.now()
        expires = now + timedelta(minutes=10)
        return cls.objects.create(
            user=user,
            email=email,
            otp_code=code,
            expires_at=expires,
        )

    def is_valid(self):
        from django.utils import timezone
        if self.is_used:
            return False
        if self.attempts >= 5:
            return False
        return timezone.now() <= self.expires_at


# ─────────────────────────────────────────────────────────────
# Post Delete Signals — Automatically destroy avatar in Cloudinary
# ─────────────────────────────────────────────────────────────
from django.db.models.signals import post_delete
from django.dispatch import receiver


@receiver(post_delete, sender=Profile)
def auto_delete_profile_cloudinary_avatar(sender, instance, **kwargs):
    if getattr(instance, "avatar", None):
        from checkins.utils import delete_cloudinary_image
        delete_cloudinary_image(instance.avatar)


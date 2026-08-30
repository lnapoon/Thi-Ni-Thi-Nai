from django.db import models
from django.contrib.auth.models import User

# pyrefly: ignore [missing-import]
from cloudinary.models import CloudinaryField


def user_avatar_path(instance, filename):
    return f"avatars/user_{instance.user.id}/{filename}"


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    avatar = CloudinaryField("image", folder="avatars", null=True, blank=True)
    bio = models.TextField(max_length=300, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def get_avatar_url(self):
        """Return full Cloudinary URL for the avatar."""
        if not self.avatar:
            return ""
        try:
            url = self.avatar.url
            if url:
                return url
        except Exception:
            pass
        val = str(self.avatar)
        if val.startswith("http"):
            return val
        from django.conf import settings

        cloud = getattr(settings, "CLOUDINARY_CLOUD_NAME", "pkxxxmpn")
        return f"https://res.cloudinary.com/{cloud}/image/upload/{val}"

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

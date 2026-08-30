from django.db import models
from django.contrib.auth.models import User
from PIL import Image, ImageOps
import io
from django.core.files.uploadedfile import InMemoryUploadedFile
import sys

def user_avatar_path(instance, filename):
    return f'avatars/user_{instance.user.id}/{filename}'

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    avatar = models.ImageField(upload_to=user_avatar_path, null=True, blank=True)
    bio = models.TextField(max_length=300, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def get_avatar_url(self):
        if not self.avatar:
            return ""
        try:
            url = self.avatar.url
            if url.startswith("http://") or url.startswith("https://"):
                return url
        except Exception:
            pass
        clean_name = str(self.avatar.name).lstrip('/')
        if not clean_name.startswith('media/'):
            clean_name = f'media/{clean_name}'
        return f"https://res.cloudinary.com/pkxxxmpn/image/upload/v1/{clean_name}"

    def __str__(self):
        return f"โปรไฟล์ของ {self.user.username}"

    def save(self, *args, **kwargs):
        # Auto-resize avatar to standard dimensions 400x400
        if self.avatar and hasattr(self.avatar, 'file') and not getattr(self, '_avatar_optimized', False):
            try:
                img = Image.open(self.avatar)
                img = ImageOps.exif_transpose(img)
                img = img.convert('RGB')
                img.thumbnail((400, 400), Image.Resampling.LANCZOS)
                
                output = io.BytesIO()
                img.save(output, format='JPEG', quality=85, optimize=True)
                output.seek(0)
                
                self.avatar = SimpleUploadedFile(
                    name=self.avatar.name,
                    content=output.read(),
                    content_type='image/jpeg'
                )
                self._avatar_optimized = True
            except Exception:
                pass

        super().save(*args, **kwargs)

def _user_get_avatar_url(user):
    try:
        if hasattr(user, 'profile') and user.profile:
            return user.profile.get_avatar_url
    except Exception:
        pass
    return ""

User.add_to_class('get_avatar_url', property(_user_get_avatar_url))

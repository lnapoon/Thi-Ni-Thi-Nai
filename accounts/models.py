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

    def __str__(self):
        return f"{self.user.username}'s Profile"

    def save(self, *args, **kwargs):
        if self.avatar and hasattr(self.avatar, 'file') and not getattr(self, '_avatar_optimized', False):
            try:
                img = Image.open(self.avatar)
                img = ImageOps.exif_transpose(img)

                if img.mode in ('RGBA', 'P'):
                    img = img.convert('RGB')

                # Resize to max 400x400 for avatar
                max_size = (400, 400)
                img.thumbnail(max_size, Image.Resampling.LANCZOS)

                output = io.BytesIO()
                img.save(output, format='JPEG', quality=85, optimize=True)
                output.seek(0)

                filename = self.avatar.name.split('/')[-1]
                if not filename.lower().endswith('.jpg'):
                    filename = f"{filename.rsplit('.', 1)[0]}.jpg"

                self.avatar = InMemoryUploadedFile(
                    output,
                    'ImageField',
                    filename,
                    'image/jpeg',
                    sys.getsizeof(output),
                    None
                )
                self._avatar_optimized = True
            except Exception:
                pass

        super().save(*args, **kwargs)

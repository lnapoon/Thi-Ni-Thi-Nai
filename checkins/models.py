from django.db import models
from django.contrib.auth.models import User
from django.urls import reverse
from cloudinary.models import CloudinaryField
from .utils import optimize_checkin_image

def checkin_photo_path(instance, filename):
    return f'checkins/user_{instance.user_id}/{filename}'

class CheckIn(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='checkins')
    place_name = models.CharField(max_length=200, verbose_name="ชื่อสถานที่")
    latitude = models.FloatField(null=True, blank=True, verbose_name="ละติจูด")
    longitude = models.FloatField(null=True, blank=True, verbose_name="ลองจิจูด")
    caption = models.TextField(max_length=500, verbose_name="ข้อความบรรยาย")
    photo = CloudinaryField('รูปภาพสถานที่', folder='checkins')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="สร้างเมื่อ")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="แก้ไขล่าสุด")

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'เช็คอิน'
        verbose_name_plural = 'รายการเช็คอิน'

    def __str__(self):
        return f"{self.place_name} โดย {self.user.username}"

    @property
    def get_photo_url(self):
        """Return full Cloudinary URL for the photo."""
        if not self.photo:
            return ""
        try:
            url = self.photo.url
            if url:
                return url
        except Exception:
            pass
        val = str(self.photo)
        if val.startswith('http'):
            return val
        from django.conf import settings
        cloud = getattr(settings, 'CLOUDINARY_CLOUD_NAME', 'pkxxxmpn')
        return f"https://res.cloudinary.com/{cloud}/image/upload/{val}"

    def get_absolute_url(self):
        return reverse('checkins:detail', kwargs={'pk': self.pk})

    @property
    def has_location(self):
        return self.latitude is not None and self.longitude is not None

    @property
    def comments_count(self):
        return self.comments.count()

    @property
    def likes_count(self):
        return self.likes.count()

    def save(self, *args, **kwargs):
        # Optimize image with Pillow prior to uploading to Cloudinary
        if self.pk is None and self.photo and hasattr(self.photo, 'file') and not getattr(self, '_photo_optimized', False):
            if hasattr(self.photo, 'seek'):
                self.photo.seek(0)
            self.photo = optimize_checkin_image(self.photo)
            self._photo_optimized = True
        super().save(*args, **kwargs)


class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='liked_checkins')
    checkin = models.ForeignKey(CheckIn, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'checkin')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} ถูกใจ {self.checkin.place_name}"


class Comment(models.Model):
    checkin = models.ForeignKey(CheckIn, on_delete=models.CASCADE, related_name='comments', verbose_name='เช็คอิน')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments', verbose_name='ผู้แสดงความคิดเห็น')
    text = models.TextField(max_length=500, verbose_name='ข้อความความคิดเห็น')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='สร้างเมื่อ')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='แก้ไขล่าสุด')

    class Meta:
        ordering = ['created_at']
        verbose_name = 'ความคิดเห็น'
        verbose_name_plural = 'ความคิดเห็นทั้งหมด'

    def __str__(self):
        return f"{self.user.username}: {self.text[:30]}"


class Bookmark(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookmarked_checkins', verbose_name='ผู้บันทึก')
    checkin = models.ForeignKey(CheckIn, on_delete=models.CASCADE, related_name='bookmarks', verbose_name='เช็คอินที่บันทึก')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='บันทึกเมื่อ')

    class Meta:
        unique_together = ('user', 'checkin')
        ordering = ['-created_at']
        verbose_name = 'บันทึกโพสต์'
        verbose_name_plural = 'โพสต์ที่บันทึกไว้'

    def __str__(self):
        return f"{self.user.username} บันทึก {self.checkin.place_name}"

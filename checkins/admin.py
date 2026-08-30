from django.contrib import admin
from django.utils.html import format_html
from .models import CheckIn, Like, Comment, Bookmark

@admin.register(CheckIn)
class CheckInAdmin(admin.ModelAdmin):
    list_display = ('photo_preview', 'place_name', 'user', 'likes_count_badge', 'comments_count_badge', 'latitude', 'longitude', 'created_at')
    list_filter = ('created_at', 'user')
    search_fields = ('place_name', 'caption', 'user__username')
    readonly_fields = ('photo_large_preview', 'created_at', 'updated_at')

    def photo_preview(self, obj):
        if obj.get_photo_url:
            return format_html('<img src="{}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px;" />', obj.get_photo_url)
        return "-"
    photo_preview.short_description = "รูปภาพ"

    def photo_large_preview(self, obj):
        if obj.get_photo_url:
            return format_html('<img src="{}" style="max-width: 300px; border-radius: 8px;" />', obj.get_photo_url)
        return "-"
    photo_large_preview.short_description = "ตัวอย่างรูปขนาดเต็ม"

    def likes_count_badge(self, obj):
        count = obj.likes.count()
        return format_html('<span style="background: #fee2e2; color: #ef4444; padding: 2px 8px; border-radius: 12px; font-weight: bold;">❤️ {}</span>', count)
    likes_count_badge.short_description = "ถูกใจ"

    def comments_count_badge(self, obj):
        count = obj.comments.count()
        return format_html('<span style="background: #e0f2fe; color: #0284c7; padding: 2px 8px; border-radius: 12px; font-weight: bold;">💬 {}</span>', count)
    comments_count_badge.short_description = "ความคิดเห็น"


@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = ('user', 'checkin', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__username', 'checkin__place_name')


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('user', 'checkin', 'short_text', 'created_at')
    list_filter = ('created_at', 'user')
    search_fields = ('text', 'user__username', 'checkin__place_name')

    def short_text(self, obj):
        return obj.text[:50] + "..." if len(obj.text) > 50 else obj.text
    short_text.short_description = "ข้อความความคิดเห็น"


@admin.register(Bookmark)
class BookmarkAdmin(admin.ModelAdmin):
    list_display = ('user', 'checkin', 'created_at')
    list_filter = ('created_at', 'user')
    search_fields = ('user__username', 'checkin__place_name')

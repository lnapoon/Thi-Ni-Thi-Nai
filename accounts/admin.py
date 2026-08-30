from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from django.utils.html import format_html
from .models import Profile, Follow

# Custom Admin Site Branding
admin.site.site_header = "ระบบจัดการหลังบ้าน - ที่นี้ที่ไหนหรือ"
admin.site.site_title = "Admin ที่นี้ที่ไหนหรือ"
admin.site.index_title = "แดชบอร์ดจัดการระบบและข้อมูลผู้ใช้"

class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'โปรไฟล์'

class UserAdmin(BaseUserAdmin):
    inlines = (ProfileInline,)
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'is_superuser', 'date_joined')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'date_joined')

admin.site.unregister(User)
admin.site.register(User, UserAdmin)


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('avatar_preview', 'user', 'followers_badge', 'following_badge', 'created_at')
    search_fields = ('user__username', 'user__email', 'bio')
    readonly_fields = ('avatar_large_preview', 'created_at', 'updated_at')

    def avatar_preview(self, obj):
        if obj.get_avatar_url:
            return format_html('<img src="{}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 50%;" />', obj.get_avatar_url)
        return "-"
    avatar_preview.short_description = "รูปโปรไฟล์"

    def avatar_large_preview(self, obj):
        if obj.get_avatar_url:
            return format_html('<img src="{}" style="max-width: 200px; border-radius: 12px;" />', obj.get_avatar_url)
        return "-"
    avatar_large_preview.short_description = "ตัวอย่างรูปขนาดเต็ม"

    def followers_badge(self, obj):
        return format_html('<span style="background: #ecfdf5; color: #059669; padding: 2px 8px; border-radius: 12px; font-weight: bold;">👥 {}</span>', obj.followers_count)
    followers_badge.short_description = "ผู้ติดตาม"

    def following_badge(self, obj):
        return format_html('<span style="background: #f1f5f9; color: #475569; padding: 2px 8px; border-radius: 12px; font-weight: bold;">🔗 {}</span>', obj.following_count)
    following_badge.short_description = "กำลังติดตาม"


@admin.register(Follow)
class FollowAdmin(admin.ModelAdmin):
    list_display = ('follower', 'following', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('follower__username', 'following__username')

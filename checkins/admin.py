from django.contrib import admin
from .models import CheckIn, Like

@admin.register(CheckIn)
class CheckInAdmin(admin.ModelAdmin):
    list_display = ('place_name', 'user', 'latitude', 'longitude', 'created_at')
    list_filter = ('created_at', 'user')
    search_fields = ('place_name', 'caption', 'user__username')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = ('user', 'checkin', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__username', 'checkin__place_name')

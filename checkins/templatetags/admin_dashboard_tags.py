from django import template
from django.contrib.auth.models import User
from checkins.models import CheckIn, Comment, Like, Bookmark

register = template.Library()

@register.simple_tag
def get_admin_stats():
    return {
        'checkins_count': CheckIn.objects.count(),
        'users_count': User.objects.count(),
        'comments_count': Comment.objects.count(),
        'likes_count': Like.objects.count(),
        'bookmarks_count': Bookmark.objects.count(),
        'recent_checkins': CheckIn.objects.select_related('user').order_by('-created_at')[:5],
        'recent_comments': Comment.objects.select_related('user', 'checkin').order_by('-created_at')[:5],
    }

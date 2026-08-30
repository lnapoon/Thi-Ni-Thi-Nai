from django import template
from django.db.models import Count
from django.contrib.auth.models import User
from checkins.models import CheckIn, Comment, Like, Bookmark
from accounts.models import Follow

register = template.Library()

@register.simple_tag
def get_admin_stats():
    checkins_count = CheckIn.objects.count()
    users_count = User.objects.count()
    comments_count = Comment.objects.count()
    likes_count = Like.objects.count()
    bookmarks_count = Bookmark.objects.count()
    follows_count = Follow.objects.count()

    # Geotagged count & percentage
    geotagged_count = CheckIn.objects.filter(latitude__isnull=False, longitude__isnull=False).count()
    geotagged_percent = int((geotagged_count / checkins_count * 100)) if checkins_count > 0 else 0

    # Top Most Liked Check-in Places
    top_checkins = CheckIn.objects.annotate(
        num_likes=Count('likes'),
        num_comments=Count('comments')
    ).select_related('user', 'user__profile').order_by('-num_likes', '-created_at')[:5]

    # Top Active Contributors
    top_users = User.objects.annotate(
        num_checkins=Count('checkins')
    ).select_related('profile').order_by('-num_checkins')[:5]

    # Recent Data
    recent_checkins = CheckIn.objects.select_related('user', 'user__profile').prefetch_related('likes', 'comments').order_by('-created_at')[:6]
    recent_comments = Comment.objects.select_related('user', 'user__profile', 'checkin').order_by('-created_at')[:6]
    recent_users = User.objects.select_related('profile').order_by('-date_joined')[:5]

    return {
        'checkins_count': checkins_count,
        'users_count': users_count,
        'comments_count': comments_count,
        'likes_count': likes_count,
        'bookmarks_count': bookmarks_count,
        'follows_count': follows_count,
        'geotagged_count': geotagged_count,
        'geotagged_percent': geotagged_percent,
        'top_checkins': top_checkins,
        'top_users': top_users,
        'recent_checkins': recent_checkins,
        'recent_comments': recent_comments,
        'recent_users': recent_users,
    }

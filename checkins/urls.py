from django.urls import path
from .views import (
    FeedView,
    CheckInDetailView,
    CheckInCreateView,
    CheckInUpdateView,
    CheckInDeleteView,
    CheckInMapView,
    ToggleLikeView,
    ToggleBookmarkView,
    CommentCreateView,
    CommentDeleteView,
)

app_name = 'checkins'

urlpatterns = [
    path('', FeedView.as_view(), name='feed'),
    path('checkin/new/', CheckInCreateView.as_view(), name='create'),
    path('checkin/<int:pk>/', CheckInDetailView.as_view(), name='detail'),
    path('checkin/<int:pk>/edit/', CheckInUpdateView.as_view(), name='edit'),
    path('checkin/<int:pk>/delete/', CheckInDeleteView.as_view(), name='delete'),
    path('checkin/<int:pk>/like/', ToggleLikeView.as_view(), name='like'),
    path('checkin/<int:pk>/bookmark/', ToggleBookmarkView.as_view(), name='bookmark'),
    path('checkin/<int:pk>/comment/', CommentCreateView.as_view(), name='comment_create'),
    path('comment/<int:pk>/delete/', CommentDeleteView.as_view(), name='comment_delete'),
    path('map/', CheckInMapView.as_view(), name='map'),
]

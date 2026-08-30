from django.urls import path
from .views import (
    SignUpView,
    CustomLoginView,
    CustomLogoutView,
    ProfileView,
    profile_edit,
    ToggleFollowView,
    UserFollowersListView,
    UserFollowingListView,
)

app_name = 'accounts'

urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('login/', CustomLoginView.as_view(), name='login'),
    path('logout/', CustomLogoutView.as_view(), name='logout'),
    path('profile/', ProfileView.as_view(), name='profile_me'),
    path('profile/edit/', profile_edit, name='profile_edit'),
    path('profile/<str:username>/', ProfileView.as_view(), name='profile_user'),
    path('follow/<str:username>/', ToggleFollowView.as_view(), name='toggle_follow'),
    path('users/<str:username>/followers/', UserFollowersListView.as_view(), name='followers_list'),
    path('users/<str:username>/following/', UserFollowingListView.as_view(), name='following_list'),
]

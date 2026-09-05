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
    UserSearchView,
    ShareRecipientsView,
    GoogleOAuthLoginView,
    GoogleOAuthCallbackView,
    GitHubOAuthLoginView,
    GitHubOAuthCallbackView,
    about_view,
)
from .otp_views import (
    PasswordResetRequestView,
    PasswordResetVerifyView,
    PasswordResetResendView,
    PasswordResetConfirmView,
)

app_name = 'accounts'

urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('login/', CustomLoginView.as_view(), name='login'),
    path('logout/', CustomLogoutView.as_view(), name='logout'),
    path('profile/', ProfileView.as_view(), name='profile_me'),
    path('profile/edit/', profile_edit, name='profile_edit'),
    path('about/', about_view, name='about'),
    path('profile/<str:username>/', ProfileView.as_view(), name='profile_user'),
    path('follow/<str:username>/', ToggleFollowView.as_view(), name='toggle_follow'),
    path('users/<str:username>/followers/', UserFollowersListView.as_view(), name='followers_list'),
    path('users/<str:username>/following/', UserFollowingListView.as_view(), name='following_list'),
    path('search/', UserSearchView.as_view(), name='search'),
    path('api/share-recipients/', ShareRecipientsView.as_view(), name='share_recipients'),

    # OAuth Social Login
    path('oauth/google/login/', GoogleOAuthLoginView.as_view(), name='google_login'),
    path('oauth/google/callback/', GoogleOAuthCallbackView.as_view(), name='google_callback'),
    path('oauth/github/login/', GitHubOAuthLoginView.as_view(), name='github_login'),
    path('oauth/github/callback/', GitHubOAuthCallbackView.as_view(), name='github_callback'),

    # Password Reset with Email OTP
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password-reset/verify/', PasswordResetVerifyView.as_view(), name='password_reset_verify'),
    path('password-reset/resend/', PasswordResetResendView.as_view(), name='password_reset_resend'),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
]

"""
URL configuration for "Thi Ni Thi Nai Rue" (ที่นี้ที่ไหนหรือ) project.
"""

from django.contrib import admin
from django.urls import path, re_path, include
from django.conf import settings
from django.conf.urls.static import static

from config.views import media_redirect_view

urlpatterns = [
    re_path(r'^media/(?P<path>.*)$', media_redirect_view, name='media_redirect'),
    path('admin/', admin.site.urls),
    path('accounts/', include('accounts.urls', namespace='accounts')),
    path('', include('checkins.urls', namespace='checkins')),
]

handler500 = 'config.views.custom_500_view'
handler403 = 'config.views.custom_403_view'
handler404 = 'config.views.custom_404_view'

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

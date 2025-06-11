"""drf_backend URL Configuration"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Your API routes
    path('api/', include('drf_api.urls')),
    
    # dj-rest-auth core login/logout/password routes
    path('api/auth/', include('dj_rest_auth.urls')),
    
    # dj-rest-auth registration (email-based signup)
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    
    # django-allauth social login (Google, GitHub, etc.)
    path('api/auth/', include('allauth.socialaccount.urls')),
]

# For serving media files
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

"""drf_backend URL Configuration"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework.authtoken.views import obtain_auth_token
from shared.views import LogoutView

schema_view = get_schema_view(
   openapi.Info(
      title="DjangoMart",
      default_version='v1',
      description="Eccommerce API for DjangoMart",
   ),
   public=True,
   permission_classes=[permissions.AllowAny],
)

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
    path('accounts/', include('allauth.urls')), 
    path('api-token-auth/', obtain_auth_token),
    path('accounts/logout/', LogoutView.as_view()),
    path('accounts/', include('django.contrib.auth.urls')),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),

]

# For serving media files
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

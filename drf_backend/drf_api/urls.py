from drf_api import views
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView  # Added for token refresh functionality
)
from .views import LoginView
from . import views

from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.github.views import GitHubOAuth2Adapter
from .views import google_auth, test_google_token,google_auth_callback

urlpatterns = [
    # Basic Routes
    path('', views.getRoutes, name="getRoutes"),
    path('login/', LoginView.as_view(), name='api-login'),
    # Product Routes
    path('products/', views.getProducts, name='products-list'),
    path('products/<int:pk>/', views.getProduct, name='product-detail'),
    # Alternative URL pattern if needed
    path('product/<int:pk>/', views.getProduct, name='product-detail-alt'),
    # Authentication Routes
    path('users/login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('users/login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Added token refresh route
    
    # User Routes
    path('users/profile/', views.getUserProfile, name="getUserProfile"),  # Changed from getUserProfiles to getUserProfile
    path('users/', views.getUsers, name="getUsers"),
    path('users/register/', views.registerUser, name="register"),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Account Activation Route
    path('activate/<str:uidb64>/<str:token>/', views.ActivateAccountView.as_view(), name='activate'),  # Added str: prefix and trailing slash
    
    # Order Routes
    path('orders/', views.addOrderItems, name='orders-add'),
    path('orders/<str:pk>/', views.getOrderById, name='user-order'),
    path('orders/<str:pk>/pay/', views.updateOrderToPaid, name='pay-order'),
    
    # Social Login Routes
    path('auth/google/', google_auth, name='google_auth'),
    path('auth/google/test/', test_google_token, name='test_google_token'),
    path('auth/google/callback/', google_auth_callback, name='google_callback')
    
]

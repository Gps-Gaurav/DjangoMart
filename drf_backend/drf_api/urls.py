from drf_api import views
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView  # Added for token refresh functionality
)
from .views import addOrderItems, getMyOrders, getOrderById, LoginView

from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.github.views import GitHubOAuth2Adapter
from dj_rest_auth.registration.views import SocialLoginView

class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter

class GitHubLogin(SocialLoginView):
    adapter_class = GitHubOAuth2Adapter

urlpatterns = [
    # Basic Routes
    path('', views.getRoutes, name="getRoutes"),
    path('login/', LoginView.as_view(), name='api-login'),
    # Product Routes
    path('products/', views.getProducts, name="getProducts"),
    path('product/<str:pk>/', views.getProduct, name="getProduct"),  # Added trailing slash
    
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
    
    path('orders/add/', addOrderItems, name='order-add'),
    path('orders/myorders/', getMyOrders, name='my-orders'),
    path('orders/<int:pk>/', getOrderById, name='order-detail'),
    
    # Social Login Routes
    path('auth/google/', GoogleLogin.as_view(), name='google_login'),
    path('auth/github/', GitHubLogin.as_view(), name='github_login'),
]

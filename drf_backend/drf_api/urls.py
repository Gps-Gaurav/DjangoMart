from drf_api import views
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView  # Added for token refresh functionality
)

urlpatterns = [
    # Basic Routes
    path('', views.getRoutes, name="getRoutes"),
    
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
    
    # Account Activation Route
    path('activate/<str:uidb64>/<str:token>/', views.ActivateAccountView.as_view(), name='activate'),  # Added str: prefix and trailing slash
]

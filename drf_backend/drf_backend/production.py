from .settings import *

DEBUG = False

# Security settings
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_SSL_REDIRECT = True

# WSGI application should use the production settings
WSGI_APPLICATION = 'drf_backend.wsgi.application'

# Update dj-rest-auth settings
SIGNUP_FIELDS = {
    'username': {
        'required': True
    },
    'email': {
        'required': True
    }
}
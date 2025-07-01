from django.contrib.auth import logout
from django.shortcuts import redirect
from django.views import View

# Swagger ke liye simple logout view (GET request se logout karega)
class LogoutView(View):
    def get(self, request):
        logout(request) 
        return redirect('/swagger/')
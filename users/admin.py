from django.contrib import admin
from .models import UserActivity
from .models import LandingPage

# Registra el modelo UserActivity
admin.site.register(UserActivity)
admin.site.register(LandingPage)

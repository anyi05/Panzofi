from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import now

# Create your models here.
class UserActivity(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="activity")
    is_superuser = models.BooleanField(default=False)  # Se actualiza automáticamente desde User
    login_time = models.DateTimeField(null=True, blank=True)
    logout_time = models.DateTimeField(null=True, blank=True)
    total_time_connected = models.DurationField(default=0)  # Acumula tiempo de conexión
    button_one_clicks = models.IntegerField(default=0)
    button_two_clicks = models.IntegerField(default=0)
    last_button_click_time = models.DateTimeField(null=True, blank=True)

    def update_total_time(self):
        """Calcula el tiempo total conectado"""
        if self.login_time and self.logout_time:
            self.total_time_connected += self.logout_time - self.login_time
            self.save()

    def __str__(self):
        return f"{self.user.username} - Superuser: {self.is_superuser}"
# models.py
class LandingPage(models.Model):
    title = models.CharField(max_length=255, blank=False, null=False)
    description = models.TextField(blank=False, null=False)
    image = models.ImageField(upload_to='landing_page/images/', blank=True, null=True)
    logo = models.ImageField(upload_to='landing_page/logos/', blank=True, null=True)

    def __str__(self):
        return self.title

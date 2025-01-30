from rest_framework import serializers
from .models import UserActivity

class UserActivitySerializer(serializers.ModelSerializer):
    # Campos del usuario, como nombre y apellido
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    is_superuser = serializers.BooleanField(source='user.is_superuser', read_only=True)  # Información del superusuario

    class Meta:
        model = UserActivity
        fields = ['id', 'user', 'first_name', 'last_name', 'username', 'is_superuser', 'login_time', 'logout_time', 'total_time_connected', 'button_one_clicks', 'button_two_clicks']

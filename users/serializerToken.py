from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.contrib.auth.models import User  # Asegúrate de que el modelo de usuario sea el correcto

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Personalización para incluir datos del usuario en la respuesta del token.
    """
    def validate(self, attrs):
        # Primero, obtenemos la validación del superclase (esto genera los tokens)
        data = super().validate(attrs)
        
        # Obtenemos el usuario autenticado
        user = self.user

        # Añadimos los datos del usuario al response (en este caso su nombre y su rol de superusuario)
        data['user'] = {
            'username': user.username,
            'is_superuser': user.is_superuser,
        }

        return data

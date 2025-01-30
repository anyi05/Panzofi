from rest_framework import viewsets
from .serializer import UserActivitySerializer
from .models import UserActivity, User
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.views import APIView
from .models import LandingPage
from django.utils import timezone
from rest_framework.decorators import action

# Vista para manejar las actividades de los usuarios
class UserView(viewsets.ModelViewSet):
    serializer_class = UserActivitySerializer
    queryset = UserActivity.objects.all()
    permission_classes = [IsAuthenticated]
       
    def get_queryset(self):
        """Restringe el acceso a la actividad del usuario actual si no es superusuario"""
        user = self.request.user
        if user.is_superuser:
            return UserActivity.objects.all()  # Superusuarios pueden ver todas las actividades
        return UserActivity.objects.filter(user=user)  # Los usuarios regulares solo pueden ver su propia actividad

    def perform_create(self, serializer):
        user = self.request.user
        if not user.is_superuser:
            # Si el usuario no es superusuario, solo pueden crear registros de actividad para ellos mismos
            serializer.save(user=user)
        else:
            # Si el usuario es superusuario, puede crear registros para otros usuarios
            serializer.save()
    @action(detail=False, methods=['get'])
    def start_session(self, request):
        """Iniciar la sesión del usuario y registrar el tiempo"""
        user = request.user

        # Comprobar si ya existe un registro de actividad, si no crear uno
        activity, created = UserActivity.objects.get_or_create(user=user)

        # Si es una nueva actividad (registro recién creado), actualizar el tiempo de inicio
        if created:
            activity.login_time = timezone.now()
            activity.save()

        return Response({"message": "Sesión iniciada."})

    @action(detail=False, methods=['get'])
    def end_session(self, request):
        """Cerrar la sesión del usuario y registrar el tiempo transcurrido"""
        user = request.user

        # Buscar la actividad del usuario
        activity = UserActivity.objects.filter(user=user).last()

        if activity:
            # Registrar el tiempo de cierre de sesión y calcular el tiempo total conectado
            activity.logout_time = timezone.now()
            activity.total_time_connected = activity.logout_time - activity.login_time
            activity.save()

        return Response({"message": "Sesión cerrada y tiempo guardado."})
# Serializador personalizado para incluir is_superuser en la respuesta del token
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        # Obtener el usuario autenticado
        user = self.user

        # Agregar is_superuser a la respuesta del token
        data["is_superuser"] = user.is_superuser  

        return data

# Vista personalizada para obtener tokens
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class ButtonClickView(APIView):
  # Asegúrate de que solo los usuarios autenticados puedan acceder
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user  # Obtener el usuario autenticado desde la solicitud
        button = request.data.get('button')  # Obtener el valor del botón presionado (1 o 2)

        # Verificar si el botón tiene un valor válido
        if button not in [1, 2]:
            return Response({"message": "Valor de botón inválido."}, status=400)

        # Verificar si ya existe una actividad para el usuario
        activity, created = UserActivity.objects.get_or_create(user=user)

        # Incrementar el contador según el botón presionado
        if button == 1:
            activity.button_one_clicks += 1
        elif button == 2:
            activity.button_two_clicks += 1

        # Actualizar el tiempo del último clic
        activity.last_button_click_time = timezone.now()

        # Guardar los cambios en la base de datos
        activity.save()

        return Response({"message": "Clic registrado correctamente."}, status=200)

class LandingPageView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        landing_page = LandingPage.objects.first()  # Obtener la primera página de destino
        data = {
            'title': landing_page.title,
            'description': landing_page.description,
            'image': landing_page.image.url,
            'logo': landing_page.logo.url,
        }
        return Response(data)
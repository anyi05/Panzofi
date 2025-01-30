from django.urls import path, include
from rest_framework import routers
from users import views  # Importar correctamente la vista
from rest_framework_simplejwt import views as jwt_views
from .views import CustomTokenObtainPairView
from .views import ButtonClickView
from .views import LandingPageView
from django.conf import settings
from django.conf.urls.static import static
from users import views

router = routers.DefaultRouter()
router.register(r'users', views.UserView, 'users')

urlpatterns = [
    path('click/', ButtonClickView.as_view(), name='button_click'),  # Mover hacia arriba
    path("prueba/", include(router.urls)),  # Corregido para incluir correctamente las rutas
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('landing/', LandingPageView.as_view(), name='user_landing_page'),
]


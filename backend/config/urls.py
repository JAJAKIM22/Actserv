from django.urls import path, include
from rest_framework.routers import DefaultRouter
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from apps.accounts.views import RegisterView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from apps.connectors.views import DatabaseConnectionViewSet
from apps.batches.views import BatchJobViewSet
from apps.files.views import StoredFileViewSet

router = DefaultRouter()
router.register('connectors', DatabaseConnectionViewSet, basename='connector')
router.register('batches',    BatchJobViewSet,           basename='batch')
router.register('files',      StoredFileViewSet,         basename='file')

urlpatterns = [
    path('api/',          include(router.urls)),
    path('api/auth/register/', RegisterView.as_view()),
    path('api/auth/login/',    TokenObtainPairView.as_view()),
    path('api/auth/refresh/',  TokenRefreshView.as_view()),
    path('api/schema/',        SpectacularAPIView.as_view()),
    path('api/docs/',          SpectacularSwaggerView.as_view(url_name='schema')),
]
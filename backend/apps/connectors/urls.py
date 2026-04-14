from rest_framework.routers import DefaultRouter
from .views import ConnectorViewSet

router = DefaultRouter()
router.register('connectors', ConnectorViewSet, basename='connectors')

urlpatterns = router.urls

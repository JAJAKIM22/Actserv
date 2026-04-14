from rest_framework.routers import DefaultRouter
from .views import BatchJobViewSet

router = DefaultRouter()
router.register('batches', BatchJobViewSet, basename='batches')

urlpatterns = router.urls
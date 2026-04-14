from rest_framework.routers import DefaultRouter
from .views import StoredFileViewSet

router = DefaultRouter()
router.register('files', StoredFileViewSet, basename='files')

urlpatterns = router.urls
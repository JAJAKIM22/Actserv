from rest_framework.routers import DefaultRouter
from .views import UserViewSet

router = DefaultRouter()
router.register('accounts/users', UserViewSet, basename='users')

urlpatterns = router.urls
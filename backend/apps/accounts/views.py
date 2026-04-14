from rest_framework import viewsets, permissions
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from .serializers import EmailTokenObtainPairSerializer, UserSerializer

User = get_user_model()


class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer


class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAdminUser]
    http_method_names = ['get', 'post', 'patch', 'delete']

    def get_queryset(self):
        return User.objects.all().order_by('-created_at')

    def get_serializer_class(self):
        from .serializers import UserSerializer
        return UserSerializer
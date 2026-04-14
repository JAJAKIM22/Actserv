from rest_framework import viewsets, permissions
from .models import Connector
from .serializers import ConnectorSerializer


class ConnectorViewSet(viewsets.ModelViewSet):
    serializer_class = ConnectorSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Connector.objects.filter(owner=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
from rest_framework import viewsets, permissions
from .models import BatchJob
from .serializers import BatchJobSerializer


class BatchJobViewSet(viewsets.ModelViewSet):
    serializer_class = BatchJobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return BatchJob.objects.filter(owner=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
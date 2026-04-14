from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import StoredFile
from .serializers import StoredFileSerializer


class StoredFileViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = StoredFileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return StoredFile.objects.filter(
            Q(owner=user) | Q(shared_with=user)
        ).distinct().order_by('-created_at')

    @action(detail=True, methods=['post'])
    def share(self, request, pk=None):
        file = self.get_object()
        if file.owner != request.user:
            return Response({'detail': 'Only the owner can share this file.'}, status=403)
        user_ids = request.data.get('user_ids', [])
        file.shared_with.add(*user_ids)
        return Response({'detail': 'Shared successfully.'})
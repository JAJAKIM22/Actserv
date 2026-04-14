from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import DatabaseConnection
from .serializers import DatabaseConnectionSerializer
import psycopg2


class ConnectorViewSet(viewsets.ModelViewSet):
    serializer_class = DatabaseConnectionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return DatabaseConnection.objects.filter(created_by=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['post'])
    def test(self, request, pk=None):
        conn = self.get_object()
        try:
            if conn.db_type == 'postgresql':
                c = psycopg2.connect(
                    host=conn.host, port=conn.port,
                    dbname=conn.database, user=conn.username,
                    password=conn.password, connect_timeout=5
                )
                c.close()
            return Response({'status': 'ok'})
        except Exception as e:
            return Response({'status': 'failed', 'error': str(e)}, status=status.HTTP_200_OK)
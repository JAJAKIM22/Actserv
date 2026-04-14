from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import BatchJob
from .serializers import BatchJobSerializer
from apps.connectors.models import DatabaseConnection
import psycopg2


from datetime import datetime, date
from decimal import Decimal


def serialize_value(value):
    if isinstance(value, (datetime, date)):
        return value.isoformat()
    if isinstance(value, Decimal):
        return float(value)
    return value


def extract_data(conn: DatabaseConnection, table_name: str, batch_size: int, offset: int):
    connection = psycopg2.connect(
        host=conn.host,
        port=conn.port,
        dbname=conn.database,
        user=conn.username,
        password=conn.password,
        connect_timeout=5
    )

    cursor = connection.cursor()
    cursor.execute(f'SELECT * FROM "{table_name}" LIMIT %s OFFSET %s', [batch_size, offset])

    columns = [desc[0] for desc in cursor.description]

    rows = []
    for row in cursor.fetchall():
        serialized_row = {
            col: serialize_value(val)
            for col, val in zip(columns, row)
        }
        rows.append(serialized_row)

    cursor.close()
    connection.close()

    return {'columns': columns, 'rows': rows}


class BatchJobViewSet(viewsets.ModelViewSet):
    serializer_class = BatchJobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return BatchJob.objects.filter(created_by=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['post'])
    def extract(self, request, pk=None):
        batch = self.get_object()
        if batch.status != 'pending':
            return Response(
                {'detail': f'Cannot extract — batch is already {batch.status}.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            data = extract_data(
                batch.connection,
                batch.table_name,
                batch.batch_size,
                batch.offset
            )
            batch.raw_data = data
            batch.edited_data = data
            batch.status = 'extracted'
            batch.save()
            return Response(BatchJobSerializer(batch).data)
        except Exception as e:
            batch.status = 'failed'
            batch.error = str(e)
            batch.save()
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        batch = self.get_object()
        if batch.status != 'extracted':
            return Response(
                {'detail': f'Cannot submit — batch status is {batch.status}.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            # Save edited data if provided
            edited = request.data
            if edited:
                batch.edited_data = edited
            batch.status = 'submitted'
            from django.utils import timezone
            batch.submitted_at = timezone.now()
            batch.save()

            # Create the exported file
            _create_export_file(batch, request.user)

            return Response(BatchJobSerializer(batch).data)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


def _create_export_file(batch: BatchJob, user):
    import json, os
    from apps.files.models import StoredFile
    from django.core.files.base import ContentFile

    data = batch.edited_data
    content = json.dumps(data, indent=2, default=str).encode('utf-8')
    filename = f'batch_{batch.id}.json'

    stored = StoredFile(
        batch_job=batch,
        owner=user,
        format='json',
        source_meta={
            'connection': batch.connection.name,
            'table': batch.table_name,
            'db_type': batch.connection.db_type,
        }
    )
    stored.file_path.save(filename, ContentFile(content), save=True)
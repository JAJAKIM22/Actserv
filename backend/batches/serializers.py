from rest_framework import serializers
from .models import BatchJob


class BatchJobSerializer(serializers.ModelSerializer):
    class Meta:
        model = BatchJob
        fields = [
            'id', 'connector', 'table_name', 'query',
            'status', 'result_rows', 'error', 'created_at', 'completed_at'
        ]
        read_only_fields = ['owner', 'status', 'result_rows', 'error', 'created_at', 'completed_at']
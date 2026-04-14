from rest_framework import serializers
from .models import BatchJob

class BatchJobSerializer(serializers.ModelSerializer):
    class Meta:
        model = BatchJob
        fields = '__all__'
        read_only_fields = ['created_by', 'status', 'raw_data', 'created_at', 'submitted_at']
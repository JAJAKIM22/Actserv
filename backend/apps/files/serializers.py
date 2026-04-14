from rest_framework import serializers
from .models import StoredFile


class StoredFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoredFile
        fields = [
            'id', 'batch_job', 'owner', 'shared_with',
            'file_path', 'format', 'source_meta', 'created_at'
        ]
        read_only_fields = ['owner', 'created_at']
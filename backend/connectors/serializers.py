from rest_framework import serializers
from .models import Connector


class ConnectorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Connector
        fields = ['id', 'name', 'db_type', 'host', 'port', 'database', 'username', 'is_active', 'created_at']
        read_only_fields = ['owner', 'created_at']
        extra_kwargs = {'password': {'write_only': True}}
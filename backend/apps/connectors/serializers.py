from rest_framework import serializers
from .models import DatabaseConnection

class DatabaseConnectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DatabaseConnection
        fields = '__all__'
        read_only_fields = ['created_by', 'created_at']
        extra_kwargs = {'password': {'write_only': True}}
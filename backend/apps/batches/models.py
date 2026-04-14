from django.db import models
from apps.accounts.models import User
from apps.connectors.models import DatabaseConnection

class BatchJob(models.Model):
    class Status(models.TextChoices):
        PENDING    = 'pending'
        EXTRACTED  = 'extracted'
        SUBMITTED  = 'submitted'
        FAILED     = 'failed'

    connection  = models.ForeignKey(DatabaseConnection, on_delete=models.CASCADE)
    table_name  = models.CharField(max_length=100)
    batch_size  = models.IntegerField(default=100)
    offset      = models.IntegerField(default=0)
    status      = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    raw_data    = models.JSONField(default=dict)   # extracted snapshot
    edited_data = models.JSONField(default=dict)   # user-modified version
    created_by  = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at  = models.DateTimeField(auto_now_add=True)
    submitted_at= models.DateTimeField(null=True, blank=True)
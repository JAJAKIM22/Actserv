from django.db import models
from apps.accounts.models import User
from apps.connectors.models import Connector


class BatchJob(models.Model):
    class Status(models.TextChoices):
        PENDING    = 'pending',    'Pending'
        RUNNING    = 'running',    'Running'
        COMPLETED  = 'completed',  'Completed'
        FAILED     = 'failed',     'Failed'

    owner       = models.ForeignKey(User, on_delete=models.CASCADE, related_name='batches')
    connector   = models.ForeignKey(Connector, on_delete=models.CASCADE, related_name='batches')
    table_name  = models.CharField(max_length=100)
    query       = models.TextField(blank=True)
    status      = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)
    result_rows = models.IntegerField(null=True, blank=True)
    error       = models.TextField(blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Batch #{self.pk} — {self.table_name} ({self.status})"
from django.db import models
from apps.accounts.models import User

class DatabaseConnection(models.Model):
    class DBType(models.TextChoices):
        POSTGRES   = 'postgresql', 'PostgreSQL'
        MYSQL      = 'mysql',      'MySQL'
        MONGODB    = 'mongodb',    'MongoDB'
        CLICKHOUSE = 'clickhouse', 'ClickHouse'

    name        = models.CharField(max_length=100)
    db_type     = models.CharField(max_length=20, choices=DBType.choices)
    host        = models.CharField(max_length=255)
    port        = models.IntegerField()
    database    = models.CharField(max_length=100)
    username    = models.CharField(max_length=100)
    password    = models.CharField(max_length=255)  # encrypt in prod
    extra_params= models.JSONField(default=dict, blank=True)
    created_by  = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at  = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.db_type})"
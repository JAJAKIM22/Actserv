from django.db import models
from apps.accounts.models import User


class Connector(models.Model):
    class DBType(models.TextChoices):
        POSTGRES   = 'postgresql', 'PostgreSQL'
        MYSQL      = 'mysql',      'MySQL'
        MSSQL      = 'mssql',      'SQL Server'
        SQLITE     = 'sqlite',     'SQLite'

    owner       = models.ForeignKey(User, on_delete=models.CASCADE, related_name='connectors')
    name        = models.CharField(max_length=100)
    db_type     = models.CharField(max_length=20, choices=DBType.choices)
    host        = models.CharField(max_length=255, blank=True)
    port        = models.PositiveIntegerField(null=True, blank=True)
    database    = models.CharField(max_length=100)
    username    = models.CharField(max_length=100, blank=True)
    password    = models.CharField(max_length=255, blank=True)  # encrypt in production
    is_active   = models.BooleanField(default=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.db_type})"
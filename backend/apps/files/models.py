from django.db import models
from apps.accounts.models import User

class StoredFile(models.Model):
    class Format(models.TextChoices):
        JSON = 'json'
        CSV  = 'csv'

    batch_job   = models.OneToOneField('batches.BatchJob', on_delete=models.CASCADE)
    owner       = models.ForeignKey(User, on_delete=models.CASCADE, related_name='files')
    shared_with = models.ManyToManyField(User, blank=True, related_name='shared_files')
    file_path   = models.FileField(upload_to='exports/')
    format      = models.CharField(max_length=4, choices=Format.choices, default=Format.JSON)
    source_meta = models.JSONField(default=dict)  # connection name, table, batch params
    created_at  = models.DateTimeField(auto_now_add=True)
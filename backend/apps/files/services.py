import json, csv, io
from datetime import datetime
from django.core.files.base import ContentFile
from .models import StoredFile

class FileStorageService:
    @staticmethod
    def save(batch_job, owner, fmt='json') -> StoredFile:
        timestamp = datetime.utcnow().strftime('%Y%m%d_%H%M%S')
        meta = {
            'connection': batch_job.connection.name,
            'db_type':    batch_job.connection.db_type,
            'table':      batch_job.table_name,
            'batch_size': batch_job.batch_size,
            'offset':     batch_job.offset,
            'submitted_at': timestamp,
        }

        if fmt == 'json':
            content = json.dumps({
                'metadata': meta,
                'data': batch_job.edited_data,
            }, default=str).encode()
            filename = f"export_{batch_job.id}_{timestamp}.json"
        else:
            buf = io.StringIO()
            writer = csv.DictWriter(buf, fieldnames=batch_job.edited_data.get('columns', []))
            writer.writeheader()
            writer.writerows(batch_job.edited_data.get('rows', []))
            content = buf.getvalue().encode()
            filename = f"export_{batch_job.id}_{timestamp}.csv"

        stored = StoredFile(
            batch_job=batch_job,
            owner=owner,
            format=fmt,
            source_meta=meta,
        )
        stored.file_path.save(filename, ContentFile(content), save=True)
        return stored
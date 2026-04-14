from abc import ABC, abstractmethod

class BaseConnector(ABC):
    def __init__(self, config):
        self.config = config

    @abstractmethod
    def test_connection(self) -> bool: ...

    @abstractmethod
    def fetch_tables(self) -> list[str]: ...

    @abstractmethod
    def fetch_data(self, table: str, batch_size: int, offset: int) -> dict: ...

    @abstractmethod
    def close(self): ...


class PostgreSQLConnector(BaseConnector):
    def __init__(self, config):
        super().__init__(config)
        import psycopg2
        self.conn = psycopg2.connect(
            host=config.host, port=config.port, dbname=config.database,
            user=config.username, password=config.password
        )

    def test_connection(self):
        return self.conn.status == 1  # STATUS_READY

    def fetch_tables(self):
        cur = self.conn.cursor()
        cur.execute("SELECT tablename FROM pg_tables WHERE schemaname='public'")
        return [r[0] for r in cur.fetchall()]

    def fetch_data(self, table, batch_size=100, offset=0):
        cur = self.conn.cursor()
        cur.execute(f'SELECT * FROM "{table}" LIMIT %s OFFSET %s', (batch_size, offset))
        cols = [desc[0] for desc in cur.description]
        rows = [dict(zip(cols, row)) for row in cur.fetchall()]
        return {'columns': cols, 'rows': rows, 'count': len(rows)}

    def close(self):
        self.conn.close()


class MySQLConnector(BaseConnector):
    def __init__(self, config):
        super().__init__(config)
        import MySQLdb
        self.conn = MySQLdb.connect(
            host=config.host, port=config.port, db=config.database,
            user=config.username, passwd=config.password
        )
    # implement fetch_tables, fetch_data, close similarly ...


class MongoDBConnector(BaseConnector):
    def __init__(self, config):
        super().__init__(config)
        from pymongo import MongoClient
        self.client = MongoClient(
            host=config.host, port=config.port,
            username=config.username, password=config.password
        )
        self.db = self.client[config.database]

    def fetch_tables(self):           # "tables" = collections
        return self.db.list_collection_names()

    def fetch_data(self, table, batch_size=100, offset=0):
        docs = list(self.db[table].find({}, {'_id': 0}).skip(offset).limit(batch_size))
        cols = list(docs[0].keys()) if docs else []
        return {'columns': cols, 'rows': docs, 'count': len(docs)}
    # ...


class ClickHouseConnector(BaseConnector):
    def __init__(self, config):
        super().__init__(config)
        from clickhouse_driver import Client
        self.client = Client(
            host=config.host, port=config.port,
            database=config.database,
            user=config.username, password=config.password
        )

    def fetch_data(self, table, batch_size=100, offset=0):
        rows, cols_meta = self.client.execute(
            f'SELECT * FROM {table} LIMIT {batch_size} OFFSET {offset}',
            with_column_types=True
        )
        cols = [c[0] for c in cols_meta]
        return {'columns': cols, 'rows': [dict(zip(cols, r)) for r in rows], 'count': len(rows)}
    # ...


class ConnectorFactory:
    _registry = {
        'postgresql': PostgreSQLConnector,
        'mysql':      MySQLConnector,
        'mongodb':    MongoDBConnector,
        'clickhouse': ClickHouseConnector,
    }

    @classmethod
    def get(cls, db_config) -> BaseConnector:
        klass = cls._registry.get(db_config.db_type)
        if not klass:
            raise ValueError(f"Unsupported DB type: {db_config.db_type}")
        return klass(db_config)

    @classmethod
    def register(cls, db_type: str, klass):
        """Extensibility hook — add new DB types at runtime."""
        cls._registry[db_type] = klass
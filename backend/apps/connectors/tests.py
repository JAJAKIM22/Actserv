from django.test import TestCase
from unittest.mock import patch, MagicMock
from .connector_factory import ConnectorFactory, PostgreSQLConnector

class ConnectorFactoryTest(TestCase):
    def test_get_returns_correct_class(self):
        cfg = MagicMock(db_type='postgresql')
        with patch.object(PostgreSQLConnector, '__init__', return_value=None):
            conn = ConnectorFactory.get(cfg)
        self.assertIsInstance(conn, PostgreSQLConnector)

    def test_unknown_type_raises(self):
        cfg = MagicMock(db_type='oracle')
        with self.assertRaises(ValueError):
            ConnectorFactory.get(cfg)
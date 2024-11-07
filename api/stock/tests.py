from django.test import SimpleTestCase
from ninja.testing import TestClient
from .api import router


class StockTest(SimpleTestCase):
    def setUp(self):
        self.maxDiff = None

    def assertIsSorted(self, arr: list):
        prev = {}
        for doc in arr:
            if not prev:
                prev = doc
            else:
                self.assertLess(prev["date"], doc["date"])
        return True

    def test_get_stock_data(self):
        client = TestClient(router)
        response = client.get("/?symbol=MmM")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(type(response.json()["data"]), list)
        self.assertGreater(len(response.json()["data"]), 0)
        self.assertIsSorted(response.json()["data"])

    def test_get_stock_data_error(self):
        client = TestClient(router)
        response = client.get("/?symbol=MmmM")

        self.assertEqual(response.status_code, 404)

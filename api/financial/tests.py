from django.test import SimpleTestCase
from ninja.testing import TestClient
from .api import router


class FinancialTest(SimpleTestCase):
    def setUp(self):
        self.maxDiff = None

    # COMMENT TO REDUCE API USAGE DAILY 25 LIMIT FOR ALPHA VANTAGE
    # def test_finance_daily(self):
    #     client = TestClient(router)
    #     response = client.get("/finance_daily?symbol=IBM&test=1")

    #     self.assertEqual(response.status_code, 200)
    #     self.assertEqual("symbol" in response.json(), True)
    #     self.assertEqual("close" in response.json(), True)
    #     self.assertEqual("volume" in response.json(), True)

    # def test_finance_daily_error(self):
    #     client = TestClient(router)
    #     response = client.get("/finance_daily?symbol=IBMMM")

    #     self.assertEqual(response.status_code, 404)

    # def test_finances(self):
    #     client = TestClient(router)
    #     response = client.get("/finances?symbol=IBM")

    #     self.assertEqual(response.status_code, 200)

    # def test_finances_error(self):
    #     client = TestClient(router)
    #     response = client.get("/finances?symbol=IBMNA")

    #     self.assertEqual(response.status_code, 404)

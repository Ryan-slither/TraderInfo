from django.test import SimpleTestCase
from ninja.testing import TestClient
from .api import router


class CompanyTest(SimpleTestCase):
    def setUp(self):
        self.maxDiff = None

    def test_get_symbols(self):
        client = TestClient(router)
        response = client.get("/symbols?search=gOoG")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"symbols": ["GOOG", "GOOGL"]})

    def test_get_symbols_error(self):
        client = TestClient(router)
        response = client.get("/symbols?search=gOoGq")

        self.assertEqual(response.status_code, 404)

    def test_get_symbol(self):
        client = TestClient(router)
        response = client.get("/symbol?symbol=goOg")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json(),
            {
                "id": "6727e0ea70a8a3c122ec14df",
                "exchange": "NMS",
                "symbol": "GOOG",
                "shortname": "Alphabet Inc.",
                "longname": "Alphabet Inc.",
                "sector": "Communication Services",
                "industry": "Internet Content & Information",
                "currentprice": 172.65,
                "marketcap": 2104292671488,
                "ebitda": 123469996032,
                "revenuegrowth": 0.151,
                "city": "Mountain View",
                "state": "CA",
                "country": "United States",
                "fulltimeemployees": 181269,
                "longbusinesssummary": "Alphabet Inc. offers various products and platforms in the United States, Europe, the Middle East, Africa, the Asia-Pacific, Canada, and Latin America. It operates through Google Services, Google Cloud, and Other Bets segments. The Google Services segment provides products and services, including ads, Android, Chrome, devices, Gmail, Google Drive, Google Maps, Google Photos, Google Play, Search, and YouTube. It is also involved in the sale of apps and in-app purchases and digital content in the Google Play and YouTube; and devices, as well as in the provision of YouTube consumer subscription services. The Google Cloud segment offers infrastructure, cybersecurity, databases, analytics, AI, and other services; Google Workspace that include cloud-based communication and collaboration tools for enterprises, such as Gmail, Docs, Drive, Calendar, and Meet; and other services for enterprise customers. The Other Bets segment sells healthcare-related and internet services. The company was incorporated in 1998 and is headquartered in Mountain View, California.",
                "weight": 0.039344210597520815,
            },
        )

    def test_get_symbol_error(self):
        client = TestClient(router)
        response = client.get("/symbol?symbol=goOgs")

        self.assertEqual(response.status_code, 404)

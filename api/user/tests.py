from django.test import SimpleTestCase
from ninja.testing import TestClient
from .api import router


class UserTest(SimpleTestCase):
    def setUp(self):
        self.maxDiff = None

    def test_insert_stock(self):
        client = TestClient(router)
        response = client.post("/create?symbol=MMM")
        new_id = response.json()["id"]

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()["message"], "Success")
        self.assertEqual("id" in response.json(), True)

        response = client.delete(f"/remove?symbol=MMM&id={new_id}")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["symbol"], "MMM")

    def test_insert_stocks(self):
        client = TestClient(router)
        response = client.post("/create?symbol=MMM")
        new_id = response.json()["id"]
        response = client.post(f"/create?symbol=GOOG&id={new_id}")

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()["message"], "Success")
        self.assertEqual(response.json()["id"], new_id)

        response = client.delete(f"/remove?symbol=MMM&id={new_id}")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["symbol"], "MMM")

        response = client.delete(f"/remove?symbol=GOOG&id={new_id}")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["symbol"], "GOOG")

    def test_delete_stock_error(self):
        client = TestClient(router)
        response = client.post("/create?symbol=MMM")
        new_id = response.json()["id"]

        response = client.delete(f"/remove?symbol=MMM&id={new_id}")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["symbol"], "MMM")

        response = client.delete(f"/remove?symbol=MMM&id={new_id}")
        self.assertEqual(response.status_code, 404)

        response = client.delete(f"/remove?symbol=MMM&id={new_id[::-1]}")
        self.assertEqual(response.status_code, 404)

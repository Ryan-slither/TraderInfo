from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import os
from dotenv import load_dotenv

load_dotenv()


def get_db():
    uri = f"mongodb+srv://{os.getenv('MONGO_USER')}:{os.getenv('MONGO_PASS')}@traderinfo.ogd0i.mongodb.net/?retryWrites=true&w=majority&appName=TraderInfo"
    client = MongoClient(uri)
    try:
        client.admin.command("ping")
        print("Pinged your deployment. You successfully connected to MongoDB!")
        return client
    except Exception as e:
        print(e)

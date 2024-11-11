from ninja import Router
from .models import UserStocks, DeletedSymbol, Success
from utils import get_db
from django.http import Http404
from bson.objectid import ObjectId

router = Router()
client = get_db()


# TO DO
@router.get("/stocks", response=UserStocks)
def list_stocks(request, id: int):
    pass


# DO NOT WORRY ABOUT PASSING USER ID IF YOU DONT HAVE IT A NEW DOC WILL BE CREATED
@router.post("/create", response={201: Success})
def insert_stock(request, symbol: str, id: str = "!"):
    if id != "!":
        check_user = client.app.users.find({"_id": ObjectId(id)})
        check_user_dict = dict(check_user)
    if id == "!" or not check_user_dict:
        result = client.app.users.insert_one({"symbols": [symbol.upper()]})
        return {"message": "Success", "id": str(result.inserted_id)}
    else:
        client.app.users.update_one(
            {"_id": ObjectId(id)}, {"$addToSet": {"symbols": symbol.upper()}}
        )
        return {"message": "Success", "id": str(id)}


@router.delete("/remove", response=DeletedSymbol)
def delete_stock(request, symbol: str, id: str):
    result = client.app.users.update_one(
        {"_id": ObjectId(id)}, {"$pull": {"symbols": symbol.upper()}}
    )

    if result.modified_count == 0:
        raise Http404("User does not have stock")

    if result.matched_count == 0:
        raise Http404("User not found")

    return {"symbol": symbol.upper()}

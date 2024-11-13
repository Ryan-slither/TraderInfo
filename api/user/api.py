from ninja import Router
from .models import UserStocks, DeletedSymbol, Success
from utils import get_db
from django.http import Http404
from bson.objectid import ObjectId

router = Router()
client = get_db()


# TO DO
@router.get("/stocks", response=UserStocks)
def list_stocks(request, id: str):
    result_symbols = client.app.users.find({"_id": ObjectId(id)})
    symbols_list = list(result_symbols)
    if len(symbols_list) == 0:
        raise Http404("User Not Found")
    symbols_to_find = symbols_list[0]["symbols"]
    result_volume = (
        client.app.stock.find({"Symbol": {"$in": symbols_to_find}})
        .sort({"Date": -1})
        .limit(len(symbols_to_find))
    )
    result_info = client.app.company.find({"Symbol": {"$in": symbols_to_find}})
    volume_list = list(result_volume)
    info_list = list(result_info)
    return_dict = {}
    return_dict["stocks"] = []
    for i in range(len(symbols_to_find)):
        new_data = {}
        new_data["symbol"] = volume_list[i]["Symbol"]
        new_data["volume"] = volume_list[i]["Volume"]
        new_data["price"] = volume_list[i]["Adj Close"]
        new_data["marketcap"] = info_list[i]["Marketcap"]
        new_data["name"] = info_list[i]["Shortname"]
        return_dict["stocks"].append(new_data)

    return return_dict


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

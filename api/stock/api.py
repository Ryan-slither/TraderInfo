from ninja import Router
from .models import Stock
from utils import get_db
from django.http import Http404

router = Router()
client = get_db()


def partition(arr: list, low: int, high: int):
    piv = arr[high]["date"]
    i = low - 1
    for j in range(low, high):
        if arr[j]["date"] <= piv:
            i += 1
            (arr[i], arr[j]) = (arr[j], arr[i])

    (arr[i + 1], arr[high]) = (arr[high], arr[i + 1])

    return i + 1


def quick_sort(arr: list, low: int, high: int):
    if low < high:
        part = partition(arr, low, high)
        quick_sort(arr, low, part - 1)
        quick_sort(arr, part + 1, high)


@router.get("/", response=Stock)
def get_stock_data(request, symbol: str):
    pipeline = [
        {"$match": {"Symbol": symbol.upper()}},
        {
            "$project": {
                "date": "$Date",
                "symbol": "$Symbol",
                "close": "$Adj Close",
                "volume": "$Volume",
                "_id": 0,
            }
        },
    ]
    stock_data = client.app.stock.aggregate(pipeline)

    stock_data_list = list(stock_data)

    if not stock_data_list:
        raise Http404("Symbol Not Found")

    stock_data_dict = {}
    stock_data_dict["data"] = stock_data_list

    for doc in stock_data_dict["data"]:
        doc["date"] = str(doc["date"]).split(sep=" ")[0]

    quick_sort(stock_data_dict["data"], 0, len(stock_data_dict["data"]) - 1)

    return stock_data_dict

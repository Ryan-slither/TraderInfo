from ninja import Router
from .models import Symbols, Symbol
from utils import get_db
from django.http import Http404

router = Router()


@router.get("/symbols", response=Symbols)
def list_symbols(request, search: str):
    client = get_db()
    symbols = client.app.company.find(
        {"Symbol": {"$regex": f"{search}.*", "$options": "i"}}, {"Symbol": 1, "_id": 0}
    )
    symbols_list = list(symbols)

    if not symbols_list:
        raise Http404("Symbol Not Found")

    return_dict = {"symbols": [company["Symbol"] for company in symbols_list]}
    return return_dict


@router.get("/symbol", response=Symbol)
def list_symbol(request, symbol: str):
    client = get_db()
    company = client.app.company.find(
        {"Symbol": {"$regex": f"{symbol}", "$options": "i"}}
    )
    company_list = list(company)

    if not company_list:
        raise Http404("Symbol Not Found")

    # Values Turned to Strings still follow type in Model
    # I think leaving underscores at beginning of id resulted in it being omitted from response
    company_dict = {
        key.lower(): str(value) for (key, value) in company_list[0].items()
    }
    company_dict["id"] = company_dict["_id"]
    del company_dict["_id"]
    return company_dict

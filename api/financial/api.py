from ninja import Router
from .models import Finances, Financial_Daily
from django.http import Http404
import requests
import os
from dotenv import load_dotenv

load_dotenv()

router = Router()
key = os.getenv("ALPHA_API")


@router.get("/finance_daily", response=Financial_Daily)
def finance_daily(request, symbol: str, test: bool = 0):
    volume = 0
    if test:
        r = requests.get(
            f"https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=15min&month=2009-01&apikey={key}"
        ).json()
    else:
        r = requests.get(
            f"https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol={symbol.upper()}&interval=15min&apikey={key}"
        ).json()

    try:
        if r["Information"]:
            raise Http404("25 LIMIT REACHED")

        if r["Error Message"]:
            raise Http404("Symbol Not Found")
    except KeyError:
        raise Http404("Api Error")

    finance_daily_dict = {}
    finance_daily_dict["symbol"] = r["Meta Data"]["2. Symbol"]
    finance_daily_dict["close"] = r["Time Series (15min)"][
        list(r["Time Series (15min)"])[0]
    ]["4. close"]
    for _, data in r["Time Series (15min)"].items():
        volume += int(data["5. volume"])
    finance_daily_dict["volume"] = volume

    return finance_daily_dict


@router.get("/finances", response=Finances)
def finances(request, symbol: str):
    r = requests.get(
        f"https://www.alphavantage.co/query?function=OVERVIEW&symbol={symbol.upper()}&apikey={key}"
    ).json()

    try:
        if r["Information"]:
            raise Http404("25 LIMIT REACHED")

        if r["Error Message"]:
            raise Http404("Symbol Not Found")

    except KeyError:
        raise Http404("Api Error")

    finances_dict = dict(r)
    finances_dict["Week52High"] = finances_dict["52WeekHigh"]
    del finances_dict["52WeekHigh"]
    finances_dict["Week52Low"] = finances_dict["52WeekLow"]
    del finances_dict["52WeekLow"]
    finances_dict["Day50MovingAverage"] = finances_dict["50DayMovingAverage"]
    del finances_dict["50DayMovingAverage"]
    finances_dict["Day200MovingAverage"] = finances_dict["200DayMovingAverage"]
    del finances_dict["200DayMovingAverage"]

    print(finances_dict)

    return finances_dict

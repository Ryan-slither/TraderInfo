from ninja import Schema
from typing import List


class Success(Schema):
    message: str
    id: str


class UserStock(Schema):
    userid: str
    symbol: str
    name: str
    price: float
    volume: int
    marketcap: int


class UserStocks(Schema):
    stocks: List[UserStock]


class DeletedSymbol(Schema):
    symbol: str

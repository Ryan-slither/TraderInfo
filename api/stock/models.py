from ninja import Schema
from typing import List, Dict


class Data(Schema):
    date: str
    symbol: str
    close: float
    volume: int


class Stock(Schema):
    data: List[Data]

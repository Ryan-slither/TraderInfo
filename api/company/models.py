from ninja import Schema
from typing import List, Dict


class Symbols(Schema):
    symbols: List[str]

class Symbol(Schema):
    id: str
    exchange: str
    symbol: str
    shortname: str
    longname: str
    sector: str
    industry: str
    currentprice: float
    marketcap: int
    ebitda: int
    revenuegrowth: float
    city: str
    state: str
    country: str
    fulltimeemployees: int
    longbusinesssummary: str
    weight: float

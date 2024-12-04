from ninja import Schema
from typing import Optional


class Financial_Daily(Schema):
    symbol: str
    close: float
    volume: int


class Finances(Schema):
    Symbol: str
    Name: str
    Description: str
    Exchange: str
    Country: str
    Sector: str
    Industry: str
    OfficialSite: str
    MarketCapitalization: float
    EBITDA: Optional[float] = None
    PERatio: float
    PEGRatio: float
    BookValue: float
    DividendPerShare: float
    DividendYield: float
    EPS: float
    ProfitMargin: float
    RevenueTTM: float
    GrossProfitTTM: float
    QuarterlyEarningsGrowthYOY: float
    QuarterlyRevenueGrowthYOY: float
    AnalystTargetPrice: float
    AnalystRatingStrongBuy: int
    AnalystRatingBuy: int
    AnalystRatingHold: int
    AnalystRatingSell: int
    AnalystRatingStrongSell: int
    Beta: float
    Week52High: float
    Week52Low: float
    Day50MovingAverage: float
    Day200MovingAverage: float
    SharesOutstanding: int
    DividendDate: str
    ExDividendDate: str

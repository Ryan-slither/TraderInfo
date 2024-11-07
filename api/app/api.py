from ninja import NinjaAPI
from company.api import router as company_router
from stock.api import router as stock_router

api = NinjaAPI()

api.add_router("/company/", company_router)
api.add_router("/stock/", stock_router)

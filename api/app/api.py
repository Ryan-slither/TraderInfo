from ninja import NinjaAPI
from company.api import router as company_router
from stock.api import router as stock_router
from financial.api import router as financial_router
from user.api import router as user_router

api = NinjaAPI()

api.add_router("/company/", company_router)
api.add_router("/stock/", stock_router)
api.add_router("/financial/", financial_router)
api.add_router("/user/", user_router)

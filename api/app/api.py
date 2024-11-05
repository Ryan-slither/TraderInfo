from ninja import NinjaAPI
from company.api import router as company_router

api = NinjaAPI()

api.add_router("/company/", company_router)
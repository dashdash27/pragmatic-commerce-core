from fastapi import APIRouter

from .routers.categories import router as categories_router

catalog_module_router = APIRouter(prefix="/catalog")

catalog_module_router.include_router(categories_router)

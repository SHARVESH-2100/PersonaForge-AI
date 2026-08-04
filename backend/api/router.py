from fastapi import APIRouter

from backend.api.Routes.analyze import router as analyze_router
from backend.api.Routes.health import router as health_router
from backend.api.Routes.personas import router as personas_router
from backend.api.Routes.products import router as products_router
from backend.api.Routes.reports import router as reports_router

router = APIRouter()

router.include_router(
    health_router,
    tags=["Health"],
)

router.include_router(
    products_router,
    prefix="/products",
    tags=["Products"],
)

router.include_router(
    personas_router,
    prefix="/personas",
    tags=["Personas"],
)

router.include_router(
    reports_router,
    prefix="/reports",
    tags=["Reports"],
)

router.include_router(
    analyze_router,
    prefix="/analyze",
    tags=["Analyze"],
)

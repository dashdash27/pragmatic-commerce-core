import logging
from contextlib import asynccontextmanager

from fastapi import APIRouter, FastAPI, Request, status
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError

# 1. Logger
from app.core.logger import setup_logging

setup_logging()
logger = logging.getLogger(__name__)


# 2. Imports
from app.core.config import settings
from app.core.database import engine
from app.core.exceptions import BaseApplicationError
from app.modules.catalog import catalog_module_router


# 3. Lifespan
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Старт приложения '{settings.APP_TITLE}' в среде: {settings.APP_ENV}")
    yield
    logger.info("Остановка приложения. Закрываем пул соединений с PostgreSQL...")
    await engine.dispose()


# 4. Create App
app = FastAPI(
    title=settings.APP_TITLE,
    lifespan=lifespan,
    docs_url="/api/docs" if settings.APP_ENV != "production" else None,
    redoc_url=None,
    openapi_url="/api/openapi.json" if settings.APP_ENV != "production" else None,
)


# 5. Exception Handlers
@app.exception_handler(RequestValidationError)
async def validation_error_handler(request: Request, exc: RequestValidationError):
    errors = jsonable_encoder(exc.errors())
    primary = errors[0] if errors else {}
    field = ".".join(str(loc) for loc in primary.get("loc", []))
    msg = primary.get("msg", "Неверный формат данных")

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "code": "VALIDATION_ERROR",
            "message": f"Ошибка в поле {field}: {msg}",
            "details": errors,
        },
    )


@app.exception_handler(BaseApplicationError)
async def global_errors_middleware(request: Request, exc: BaseApplicationError):
    logger.warning("Бизнес-отказ: code=%s, message='%s'", exc.code, exc.message)
    return JSONResponse(
        status_code=exc.status_code,
        content={"code": exc.code, "message": exc.message, "details": None},
    )


@app.exception_handler(SQLAlchemyError)
async def database_error_handler(request: Request, exc: SQLAlchemyError):
    logger.exception("CRITICAL: Авария инфраструктуры СУБД")
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={
            "code": "DATABASE_ERROR",
            "message": "Сервис временно недоступен. Проблемы с базой данных. Попробуйте позже.",
            "details": None,
        },
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception("Непредвиденный программный сбой")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "code": "INTERNAL_SERVER_ERROR",
            "message": "Произошла внутренняя ошибка сервера. Инженеры уже занимаются решением.",
            "details": None,
        },
    )


# 6. CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 7. Routers
api_v1_router = APIRouter(prefix="/api/v1")
api_v1_router.include_router(catalog_module_router)

app.include_router(api_v1_router)

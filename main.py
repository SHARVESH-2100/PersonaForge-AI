import logging

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.api.router import router
from backend.config import settings
from backend.database.connection import close_mongo_connection, connect_to_mongo

logging.basicConfig(level=settings.LOG_LEVEL)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="PersonaForge AI",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "body": exc.body},
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled exception during request processing")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error."},
    )


@app.on_event("startup")
async def startup_event() -> None:
    try:
        await connect_to_mongo()
    except Exception as exc:
        logger.warning("MongoDB unavailable at startup: %s. The API will start in degraded mode.", exc)


@app.on_event("shutdown")
async def shutdown_event() -> None:
    await close_mongo_connection()


@app.get("/")
async def root() -> dict[str, str]:
    return {"message": "Welcome to PersonaForge AI 🚀"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=8001, reload=True)

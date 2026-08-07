from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from backend.app.config.settings import settings
from backend.app.core.logging import logger
from backend.app.core.exceptions import (
    OrbitAIException,
    orbit_ai_exception_handler,
    http_exception_handler,
    global_exception_handler,
)
from backend.app.database.session import init_db
from backend.app.api.v1 import health, endpoints

def create_application() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        openapi_url=f"{settings.API_V1_STR}/openapi.json",
        docs_url=f"{settings.API_V1_STR}/docs",
        redoc_url=f"{settings.API_V1_STR}/redoc",
    )

    # CORS Configuration
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Global Exception Handlers
    app.add_exception_handler(OrbitAIException, orbit_ai_exception_handler)
    app.add_exception_handler(HTTPException, http_exception_handler)
    app.add_exception_handler(Exception, global_exception_handler)

    # Health Check Router (Root level GET /health)
    app.include_router(health.router, tags=["Health"])

    # API v1 Router (/api/v1 prefix and root level fallback for placeholders)
    app.include_router(endpoints.router, prefix=settings.API_V1_STR, tags=["Workflows"])
    app.include_router(endpoints.router, tags=["Workflows Root Fallback"])

    @app.on_event("startup")
    def on_startup():
        logger.info(f"Starting {settings.PROJECT_NAME} v{settings.VERSION}")
        init_db()

    return app

app = create_application()

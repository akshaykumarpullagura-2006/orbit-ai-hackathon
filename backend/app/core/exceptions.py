from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from backend.app.core.logging import logger
from backend.app.core.response import error_response

class OrbitAIException(Exception):
    def __init__(self, message: str, status_code: int = 400, details: any = None):
        self.message = message
        self.status_code = status_code
        self.details = details

async def orbit_ai_exception_handler(request: Request, exc: OrbitAIException):
    logger.error(f"OrbitAIException [{exc.status_code}] on {request.url.path}: {exc.message}")
    return JSONResponse(
        status_code=exc.status_code,
        content=error_response(message=exc.message, error_details=exc.details).model_dump()
    )

async def http_exception_handler(request: Request, exc: HTTPException):
    logger.warning(f"HTTPException [{exc.status_code}] on {request.url.path}: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content=error_response(message=str(exc.detail)).model_dump()
    )

async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled Exception on {request.url.path}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content=error_response(message="Internal server error", error_details=str(exc)).model_dump()
    )

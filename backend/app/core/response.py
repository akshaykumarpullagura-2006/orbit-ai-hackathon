from typing import Generic, TypeVar, Optional, Any
from pydantic import BaseModel

T = TypeVar("T")

class APIResponse(BaseModel, Generic[T]):
    success: bool = True
    message: str = "Operation completed successfully"
    data: Optional[T] = None
    error: Optional[Any] = None

def success_response(data: Any = None, message: str = "Operation completed successfully") -> APIResponse:
    return APIResponse(success=True, message=message, data=data, error=None)

def error_response(message: str = "An error occurred", error_details: Any = None) -> APIResponse:
    return APIResponse(success=False, message=message, data=None, error=error_details)

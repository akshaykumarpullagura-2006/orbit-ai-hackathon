import time
from typing import Callable, Any, Dict
from backend.app.core.logging import logger

def execute_with_retry(
    fn: Callable[[], Any],
    max_retries: int = 3,
    delay_seconds: float = 1.0,
    fallback_fn: Callable[[], Any] = None
) -> Any:
    """
    Executes a callable with automatic retries, exponential backoff, and fallback handling.
    Catches rate limits, timeouts, and API exceptions.
    """
    for attempt in range(1, max_retries + 1):
        try:
            return fn()
        except Exception as err:
            logger.warn(f"Execution attempt {attempt}/{max_retries} failed: {str(err)}")
            if attempt < max_retries:
                time.sleep(delay_seconds * attempt)
            else:
                logger.error(f"All {max_retries} attempts failed. Invoking fallback recovery.")
                if fallback_fn:
                    return fallback_fn()
                raise err

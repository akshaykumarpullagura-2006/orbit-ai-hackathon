import os
import json
import urllib.request
import urllib.error
from typing import Dict, Any

from backend.app.config.settings import settings
from backend.app.core.logging import logger
from backend.app.agents.schema_validator import schema_validator
from backend.app.utils.retry_handler import execute_with_retry

GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

class GeminiService:
    @staticmethod
    def get_api_key() -> str:
        return os.getenv("GEMINI_API_KEY") or os.getenv("VITE_GEMINI_API_KEY") or getattr(settings, "GEMINI_API_KEY", "")

    @staticmethod
    def call_gemini_agent(agent_id: str, prompt: str, fallback_data: Dict[str, Any]) -> Dict[str, Any]:
        api_key = GeminiService.get_api_key()

        if not api_key:
            logger.info(f"Gemini API Key not set. Returning structured JSON fallback for {agent_id}.")
            return fallback_data

        def _make_api_call():
            url = f"{GEMINI_ENDPOINT}?key={api_key}"
            headers = {"Content-Type": "application/json"}
            payload = {
                "contents": [
                    {
                        "role": "user",
                        "parts": [{"text": prompt}]
                    }
                ],
                "generationConfig": {
                    "responseMimeType": "application/json",
                    "temperature": 0.2
                }
            }

            req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers=headers, method="POST")
            with urllib.request.urlopen(req, timeout=12) as resp:
                resp_bytes = resp.read()
                data = json.loads(resp_bytes.decode("utf-8"))
                candidate_text = data["candidates"][0]["content"]["parts"][0]["text"]
                return schema_validator.validate(agent_id, candidate_text)

        try:
            return execute_with_retry(_make_api_call, max_retries=2, fallback_fn=lambda: fallback_data)
        except Exception as err:
            logger.warn(f"Gemini AI call notice for {agent_id}: {str(err)}. Using schema fallback.")
            return fallback_data

gemini_service = GeminiService()

import logging
import time
from typing import Optional

import google.generativeai as genai

from backend.config import settings

logger = logging.getLogger(__name__)
MODEL_NAME = "gemini-3-flash-preview"

if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)
else:
    logger.warning("GEMINI_API_KEY is not set. Gemini AI routes will fail until it is configured.")

MODEL = genai.GenerativeModel(MODEL_NAME)


def generate_prompt(command: str, context: Optional[str] = None) -> str:
    if context:
        return f"{command}\n\nContext:\n{context}"
    return command


def generate_text(command: str, context: Optional[str] = None, max_output_tokens: int = 256) -> str:
    prompt = generate_prompt(command, context)
    last_exception = None

    for attempt in range(3):
        try:
            response = MODEL.generate_content(
                prompt,
                generation_config={"max_output_tokens": max_output_tokens},
            )
            text = getattr(response, "text", None)
            if text is None:
                raise RuntimeError("Gemini did not return text.")
            return text.strip()
        except Exception as exc:
            last_exception = exc
            logger.warning("Gemini generation attempt %s failed: %s", attempt + 1, exc)
            if attempt < 2:
                time.sleep(2 ** attempt)

    logger.error("Gemini generation failed after retries.")
    raise RuntimeError("Gemini AI generation failed.") from last_exception

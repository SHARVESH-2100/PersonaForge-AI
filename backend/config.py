from pathlib import Path
from typing import List, Optional

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    MONGODB_URI: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "personaforge_ai"
    GEMINI_API_KEY: Optional[str] = None
    ALLOWED_ORIGINS: List[str] = ["*"]
    LOG_LEVEL: str = "INFO"

    model_config = SettingsConfigDict(
        # Root .env first, then backend/.env (later files take precedence).
        env_file=(Path(__file__).resolve().parent.parent / ".env", Path(__file__).resolve().parent / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()

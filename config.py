from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    MONGODB_URI: str = "url"
    DATABASE_NAME: str = "name" 
    GEMINI_API_KEY: str = "GOOGLE_API_KEY=YOUR_API_KEY"

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()
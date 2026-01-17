from functools import lru_cache
from pathlib import Path
from typing import List

from pydantic import AnyHttpUrl, PostgresDsn
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=Path(__file__).parent.parent.parent / ".env",  # absolute path to backend/.env
        env_file_encoding="utf-8",
    )

    PROJECT_NAME: str = "HRMS Lite Backend"
    ENV: str = "development"

    DATABASE_URL: PostgresDsn
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = []


@lru_cache
def get_settings() -> Settings:
    return Settings()

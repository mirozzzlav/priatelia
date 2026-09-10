from functools import lru_cache
from pathlib import Path

from pydantic import field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

ROOT_DIR = Path(__file__).resolve().parents[4]


class Settings(BaseSettings):
    app_env: str = "development"
    database_url: str = "postgresql://priatelia:priatelia@database:5432/priatelia"
    jwt_secret: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expires_minutes: int = 60 * 24 * 30
    web_app_url: str = "http://localhost:4444"
    cors_origins: list[str] | None = None

    smtp_host: str = "mailpit"
    smtp_port: int = 1026
    smtp_from: str = "noreply@priatelia.local"
    smtp_username: str | None = None
    smtp_password: str | None = None
    smtp_starttls: bool = False
    smtp_use_tls: bool = False
    notification_worker_batch_size: int = 10
    notification_worker_poll_seconds: float = 2.0
    notification_worker_max_attempts: int = 5
    notification_worker_processing_timeout_seconds: int = 300

    media_endpoint: str = "media:9000"
    media_access_key: str = "priatelia"
    media_secret_key: str = "priatelia"
    media_bucket: str = "profile-photos"
    media_public_url: str = "/profile-photos"
    media_secure: bool = False

    model_config = SettingsConfigDict(
        env_file=ROOT_DIR / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @field_validator("cors_origins", mode="before")
    @classmethod
    def normalize_empty_cors_origins(cls, value):
        return None if value == "" else value

    @model_validator(mode="after")
    def set_default_cors_origins(self) -> "Settings":
        if self.cors_origins is None:
            self.cors_origins = [self.web_app_url]
        return self


@lru_cache
def get_settings() -> Settings:
    return Settings()

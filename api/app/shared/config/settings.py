from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_env: str = "development"
    database_url: str = "postgresql://priatelia:priatelia@database:5432/priatelia"
    jwt_secret: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expires_minutes: int = 60 * 24 * 30
    cors_origins: list[str] = [
        "http://localhost:4444",
        "http://127.0.0.1:4444",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]
    web_app_url: str = "http://localhost:4444"

    smtp_host: str = "mailpit"
    smtp_port: int = 1026
    smtp_from: str = "noreply@priatelia.local"
    notification_worker_batch_size: int = 10
    notification_worker_poll_seconds: float = 2.0
    notification_worker_max_attempts: int = 5
    notification_worker_processing_timeout_seconds: int = 300

    media_endpoint: str = "media:9000"
    media_access_key: str = "priatelia"
    media_secret_key: str = "priatelia"
    media_bucket: str = "profile-photos"
    media_public_url: str = "http://localhost:9000/profile-photos"
    media_secure: bool = False

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()

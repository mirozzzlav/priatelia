from minio import Minio

from app.shared.config.settings import get_settings


def create_media_client() -> Minio:
    settings = get_settings()
    return Minio(
        settings.media_endpoint,
        access_key=settings.media_access_key,
        secret_key=settings.media_secret_key,
        secure=settings.media_secure,
    )

from datetime import UTC, datetime, timedelta
from uuid import UUID

import jwt

from app.shared.config.settings import get_settings


def create_access_token(user_id: UUID, nickname: str) -> str:
    settings = get_settings()
    expires_at = datetime.now(UTC) + timedelta(minutes=settings.jwt_expires_minutes)
    payload = {
        "exp": expires_at,
        "nickname": nickname,
        "sub": str(user_id),
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def decode_access_token(token: str) -> dict[str, str]:
    settings = get_settings()
    return jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])

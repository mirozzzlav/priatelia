from typing import Any

from fastapi import APIRouter, Depends
from psycopg import AsyncConnection

from app.modules.auth.repository import AuthRepository
from app.modules.auth.schemas import ActivationRequest, LoginRequest, RegisterRequest
from app.modules.auth.service import AuthService
from app.modules.notifications.repository import NotificationRepository
from app.modules.notifications.service import NotificationService
from app.shared.auth.dependencies import CurrentUser, get_current_user
from app.shared.database.connection import get_connection
from app.shared.events.repository import EventRepository

router = APIRouter(tags=["auth"])


def _api_response(result: Any) -> dict[str, Any]:
    if isinstance(result, dict) and "errors" in result:
        return {"data": {"errors": result["errors"]}, "status": "error"}
    return {"data": result.model_dump(), "status": "success"}


@router.post("/auth/register")
async def register(
    data: RegisterRequest,
    connection: AsyncConnection = Depends(get_connection),
) -> dict[str, Any]:
    service = AuthService(
        AuthRepository(connection),
        EventRepository(connection),
        NotificationService(NotificationRepository(connection)),
    )
    result = await service.register(data)
    await connection.commit()
    return _api_response(result)


@router.post("/auth/login")
async def login(
    data: LoginRequest,
    connection: AsyncConnection = Depends(get_connection),
) -> dict[str, Any]:
    service = AuthService(
        AuthRepository(connection),
        EventRepository(connection),
        NotificationService(NotificationRepository(connection)),
    )
    return _api_response(await service.login(data))


@router.post("/auth/activate")
async def activate_account(
    data: ActivationRequest,
    connection: AsyncConnection = Depends(get_connection),
) -> dict[str, Any]:
    service = AuthService(
        AuthRepository(connection),
        EventRepository(connection),
        NotificationService(NotificationRepository(connection)),
    )
    result = await service.activate_account(data)
    await connection.commit()
    return _api_response(result)


@router.put("/profile/password")
async def update_password(
    data: dict[str, str],
    current_user: CurrentUser = Depends(get_current_user),
    connection: AsyncConnection = Depends(get_connection),
) -> dict[str, Any]:
    service = AuthService(
        AuthRepository(connection),
        EventRepository(connection),
        NotificationService(NotificationRepository(connection)),
    )
    errors = await service.update_password(
        current_user.id,
        data.get("currentPassword", ""),
        data.get("password", ""),
        data.get("passwordConfirmation", ""),
    )
    await connection.commit()
    if errors:
        return {"data": {"errors": errors}, "status": "error"}
    return {"data": {"saved": True}, "status": "success"}

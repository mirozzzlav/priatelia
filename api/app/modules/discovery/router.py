from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from psycopg import AsyncConnection

from app.modules.discovery.repository import DiscoveryRepository
from app.modules.discovery.schemas import DiscoverySettingsRequest
from app.modules.discovery.service import DiscoveryService
from app.shared.auth.dependencies import CurrentUser, get_current_user
from app.shared.database.connection import get_connection
from app.shared.events.repository import EventRepository

router = APIRouter(tags=["discovery"])


@router.get("/discovery/profile")
async def get_person_preview(
    current_user: CurrentUser = Depends(get_current_user),
    connection: AsyncConnection = Depends(get_connection),
) -> dict[str, Any]:
    preview = await DiscoveryRepository(connection).get_next_profile(current_user.id)
    if preview is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No discovery profiles available",
        )
    return preview.model_dump()


@router.get("/discovery/settings")
async def get_discovery_settings(
    current_user: CurrentUser = Depends(get_current_user),
    connection: AsyncConnection = Depends(get_connection),
) -> dict[str, Any]:
    settings = await DiscoveryRepository(connection).get_settings(current_user.id)
    if settings is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Discovery settings not found",
        )
    return settings.model_dump()


@router.put("/discovery/settings")
async def update_discovery_settings(
    data: DiscoverySettingsRequest,
    current_user: CurrentUser = Depends(get_current_user),
    connection: AsyncConnection = Depends(get_connection),
) -> dict[str, Any]:
    service = DiscoveryService(
        DiscoveryRepository(connection),
        EventRepository(connection),
    )
    errors = await service.update_settings(current_user.id, data)
    await connection.commit()

    if errors:
        return {"data": {"errors": errors}, "status": "error"}
    return {"data": {"saved": True}, "status": "success"}

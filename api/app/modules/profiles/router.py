from typing import Any

from fastapi import APIRouter, Depends
from psycopg import AsyncConnection

from app.modules.profiles.repository import ProfileRepository
from app.modules.profiles.schemas import ProfileUpdateRequest
from app.modules.profiles.service import ProfileService
from app.shared.auth.dependencies import CurrentUser, get_current_user
from app.shared.database.connection import get_connection
from app.shared.events.repository import EventRepository

router = APIRouter(tags=["profiles"])


@router.get("/profile")
async def get_profile(
    current_user: CurrentUser = Depends(get_current_user),
    connection: AsyncConnection = Depends(get_connection),
) -> dict[str, Any]:
    repository = ProfileRepository(connection)
    profile = await repository.get_profile(current_user.id)
    photos = await repository.list_photos(current_user.id)

    if profile is None:
        return {
            "nickname": current_user.nickname,
            "birthDate": "",
            "location": "",
            "bio": "",
            "photos": [],
        }

    return {
        "nickname": profile.nickname,
        "birthDate": profile.birth_date.isoformat(),
        "location": profile.location,
        "bio": profile.bio,
        "photos": [photo.model_dump() for photo in photos],
    }


@router.put("/profile")
async def update_profile(
    data: ProfileUpdateRequest,
    current_user: CurrentUser = Depends(get_current_user),
    connection: AsyncConnection = Depends(get_connection),
) -> dict[str, Any]:
    service = ProfileService(ProfileRepository(connection), EventRepository(connection))
    errors = await service.update_profile(current_user.id, data)
    await connection.commit()

    if errors:
        return {"data": {"errors": errors}, "status": "error"}
    return {"data": {"saved": True}, "status": "success"}

from typing import Any

from fastapi import APIRouter, Depends
from psycopg import AsyncConnection

from app.modules.profiles.repository import ProfileRepository
from app.modules.profiles.schemas import InterestTag, ProfileUpdateRequest
from app.modules.profiles.service import ProfileService
from app.shared.auth.dependencies import CurrentUser, get_current_user
from app.shared.database.connection import get_connection
from app.shared.events.repository import EventRepository

router = APIRouter(tags=["profiles"])


@router.get("/interests")
async def list_interest_options(
    query: str = "",
    connection: AsyncConnection = Depends(get_connection),
) -> list[InterestTag]:
    return await ProfileRepository(connection).list_interest_options(query)


@router.get("/profile")
async def get_profile(
    current_user: CurrentUser = Depends(get_current_user),
    connection: AsyncConnection = Depends(get_connection),
) -> dict[str, Any]:
    repository = ProfileRepository(connection)
    profile = await repository.get_profile(current_user.id)
    interests = await repository.list_interests(current_user.id)
    photos = await repository.list_photos(current_user.id)

    if profile is None:
        return {
            "nickname": current_user.nickname,
            "birthDate": "",
            "interests": [],
            "location": "",
            "locationLatitude": None,
            "locationLongitude": None,
            "bio": "",
            "photos": [],
        }

    return {
        "nickname": profile.nickname,
        "birthDate": profile.birth_date.isoformat(),
        "interests": [interest.model_dump() for interest in interests],
        "location": profile.location,
        "locationLatitude": profile.latitude,
        "locationLongitude": profile.longitude,
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

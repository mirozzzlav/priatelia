from typing import Any
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from psycopg import AsyncConnection

from app.modules.matching.repository import MatchingRepository
from app.modules.matching.schemas import ProfileActionRequest
from app.modules.matching.service import MatchingService
from app.shared.auth.dependencies import CurrentUser, get_current_user
from app.shared.database.connection import get_connection
from app.shared.events.repository import EventRepository

router = APIRouter(tags=["matching"])


@router.post("/discovery/profiles/{profile_id}/action", status_code=204)
async def submit_profile_action(
    profile_id: UUID,
    data: ProfileActionRequest,
    current_user: CurrentUser = Depends(get_current_user),
    connection: AsyncConnection = Depends(get_connection),
) -> None:
    service = MatchingService(MatchingRepository(connection), EventRepository(connection))
    try:
        await service.submit_action(current_user.id, profile_id, data.action)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc
    await connection.commit()


@router.get("/matches")
async def list_matches(
    current_user: CurrentUser = Depends(get_current_user),
    connection: AsyncConnection = Depends(get_connection),
) -> list[dict[str, Any]]:
    matches = await MatchingRepository(connection).list_matches(current_user.id)
    return [
        {
            "id": str(match.id),
            "otherUserId": str(match.other_user_id),
            "createdAt": match.created_at.isoformat(),
        }
        for match in matches
    ]

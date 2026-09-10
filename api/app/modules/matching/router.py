from typing import Any
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from psycopg import AsyncConnection

from app.modules.chats.repository import ChatRepository
from app.modules.chats.service import ChatService
from app.modules.matching.repository import MatchingRepository
from app.modules.matching.schemas import ProfileActionRequest, ProfileActionResponse
from app.modules.matching.service import MatchingService
from app.modules.profiles.repository import ProfileRepository
from app.shared.auth.dependencies import CurrentUser, get_current_user
from app.shared.database.connection import get_connection
from app.shared.events.repository import EventRepository

router = APIRouter(tags=["matching"])


@router.post("/discovery/profiles/{profile_id}/action")
async def submit_profile_action(
    profile_id: UUID,
    data: ProfileActionRequest,
    current_user: CurrentUser = Depends(get_current_user),
    connection: AsyncConnection = Depends(get_connection),
) -> dict:
    matching_repository = MatchingRepository(connection)
    events_repository = EventRepository(connection)
    service = MatchingService(matching_repository, events_repository)
    try:
        match_id = await service.submit_action(current_user.id, profile_id, data.action)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

    match = None
    if match_id is not None:
        chat_service = ChatService(
            chats=ChatRepository(connection),
            matching=matching_repository,
            profiles=ProfileRepository(connection),
            events=events_repository,
        )
        matches = await chat_service.list_chat_matches(current_user.id)
        match = next((item for item in matches if item.id == str(match_id)), None)

    await connection.commit()
    return ProfileActionResponse(matched=match is not None, match=match).model_dump()


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

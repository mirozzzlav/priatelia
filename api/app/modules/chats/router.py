from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from psycopg import AsyncConnection

from app.modules.chats.repository import ChatRepository
from app.modules.chats.schemas import SendChatMessageRequest
from app.modules.chats.service import ChatService
from app.modules.matching.repository import MatchingRepository
from app.modules.profiles.repository import ProfileRepository
from app.shared.auth.dependencies import CurrentUser, get_current_user
from app.shared.database.connection import get_connection
from app.shared.events.repository import EventRepository

router = APIRouter(tags=["chats"])


def _service(connection: AsyncConnection) -> ChatService:
    return ChatService(
        chats=ChatRepository(connection),
        matching=MatchingRepository(connection),
        profiles=ProfileRepository(connection),
        events=EventRepository(connection),
    )


@router.get("/chats/matches")
async def list_chat_matches(
    current_user: CurrentUser = Depends(get_current_user),
    connection: AsyncConnection = Depends(get_connection),
):
    matches = await _service(connection).list_chat_matches(current_user.id)
    return [match.model_dump() for match in matches]


@router.get("/chats/matches/{match_id}")
async def get_chat_thread(
    match_id: UUID,
    current_user: CurrentUser = Depends(get_current_user),
    connection: AsyncConnection = Depends(get_connection),
):
    thread = await _service(connection).get_thread(current_user.id, match_id)
    if thread is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat not found",
        )
    await connection.commit()
    return thread.model_dump()


@router.post("/chats/matches/{match_id}/messages")
async def send_chat_message(
    match_id: UUID,
    data: SendChatMessageRequest,
    current_user: CurrentUser = Depends(get_current_user),
    connection: AsyncConnection = Depends(get_connection),
):
    if not data.text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message is empty",
        )

    message = await _service(connection).send_message(
        current_user.id,
        match_id,
        data.text,
    )
    await connection.commit()
    if message is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat not found",
        )
    return message.model_dump()

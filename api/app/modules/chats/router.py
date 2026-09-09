import json
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, WebSocket, status
from psycopg import AsyncConnection
from starlette.websockets import WebSocketDisconnect

from app.modules.chats.repository import ChatRepository
from app.modules.chats.schemas import MarkChatMatchesSeenRequest, SendChatMessageRequest
from app.modules.chats.service import ChatService
from app.modules.chats.websocket_manager import chat_websocket_manager
from app.modules.matching.repository import MatchingRepository
from app.modules.profiles.repository import ProfileRepository
from app.shared.auth.dependencies import (
    CurrentUser,
    get_current_user,
    get_current_user_from_token,
)
from app.shared.database.connection import get_connection, get_database_pool
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


@router.post("/chats/matches/seen", status_code=status.HTTP_204_NO_CONTENT)
async def mark_chat_matches_seen(
    data: MarkChatMatchesSeenRequest,
    current_user: CurrentUser = Depends(get_current_user),
    connection: AsyncConnection = Depends(get_connection),
):
    await _service(connection).mark_matches_seen(current_user.id, data.matchIds)
    await connection.commit()


@router.get("/chats/matches/{match_id}/profile")
async def get_chat_match_profile(
    match_id: UUID,
    current_user: CurrentUser = Depends(get_current_user),
    connection: AsyncConnection = Depends(get_connection),
):
    profile = await _service(connection).get_match_profile(current_user.id, match_id)
    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found",
        )
    return profile.model_dump()


@router.get("/chats/matches/{match_id}")
async def get_chat_thread(
    match_id: UUID,
    current_user: CurrentUser = Depends(get_current_user),
    connection: AsyncConnection = Depends(get_connection),
):
    service = _service(connection)
    receipt = await service.mark_thread_read(current_user.id, match_id)
    if receipt is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat not found",
        )

    thread = await service.get_thread(current_user.id, match_id)
    if thread is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat not found",
        )
    await connection.commit()
    await chat_websocket_manager.broadcast_receipt(
        match_id,
        current_user.id,
        receipt,
    )
    return thread.model_dump()


@router.post("/chats/matches/{match_id}/read", status_code=status.HTTP_204_NO_CONTENT)
async def mark_chat_thread_read(
    match_id: UUID,
    current_user: CurrentUser = Depends(get_current_user),
    connection: AsyncConnection = Depends(get_connection),
):
    receipt = await _service(connection).mark_thread_read(
        current_user.id,
        match_id,
    )
    if receipt is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat not found",
        )

    await connection.commit()
    await chat_websocket_manager.broadcast_receipt(
        match_id,
        current_user.id,
        receipt,
    )


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
    await chat_websocket_manager.broadcast_message(
        match_id,
        current_user.id,
        message,
    )
    return message.model_dump()


@router.websocket("/chats/matches/{match_id}/stream")
async def stream_chat_messages(websocket: WebSocket, match_id: UUID):
    token = websocket.query_params.get("token")
    if token is None:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    try:
        current_user = await get_current_user_from_token(token)
    except HTTPException:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    pool = get_database_pool()
    async with pool.connection() as connection:
        can_access_match = await MatchingRepository(connection).user_can_access_match(
            current_user.id,
            match_id,
        )

    if not can_access_match:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    await chat_websocket_manager.connect(match_id, current_user.id, websocket)

    try:
        while True:
            try:
                message = json.loads(await websocket.receive_text())
            except json.JSONDecodeError:
                continue

            if not isinstance(message, dict):
                continue

            if message.get("type") != "message_delivered":
                continue

            async with pool.connection() as connection:
                receipt = await _service(connection).mark_thread_delivered(
                    current_user.id,
                    match_id,
                )

                if receipt is None:
                    continue

                await connection.commit()

            await chat_websocket_manager.broadcast_receipt(
                match_id,
                current_user.id,
                receipt,
            )
    except WebSocketDisconnect:
        chat_websocket_manager.disconnect(match_id, websocket)

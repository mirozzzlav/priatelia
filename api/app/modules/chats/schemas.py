from dataclasses import dataclass
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class SendChatMessageRequest(BaseModel):
    text: str


class ChatMatch(BaseModel):
    id: str
    age: str
    lastMessage: str | None
    lastMessageAt: str | None
    location: str
    name: str
    photo: str
    unreadCount: int


class ChatMessage(BaseModel):
    id: str
    matchId: str
    sender: str
    sentAt: str
    text: str


class ChatThread(BaseModel):
    match: ChatMatch
    messages: list[ChatMessage]


@dataclass(frozen=True)
class ChatMessageRecord:
    id: UUID
    match_id: UUID
    sender_user_id: UUID
    text: str
    sent_at: datetime

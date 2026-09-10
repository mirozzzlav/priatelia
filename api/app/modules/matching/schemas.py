from dataclasses import dataclass
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

from app.modules.chats.schemas import ChatMatch


class ProfileActionRequest(BaseModel):
    action: str


class ProfileActionResponse(BaseModel):
    matched: bool
    match: ChatMatch | None = None


@dataclass(frozen=True)
class MatchRecord:
    id: UUID
    other_user_id: UUID
    created_at: datetime

from dataclasses import dataclass
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class ProfileActionRequest(BaseModel):
    action: str


@dataclass(frozen=True)
class MatchRecord:
    id: UUID
    other_user_id: UUID
    created_at: datetime

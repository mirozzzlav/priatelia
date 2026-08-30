from dataclasses import dataclass
from datetime import date
from uuid import UUID

from pydantic import BaseModel


class ProfilePhoto(BaseModel):
    id: str
    isPrimary: bool
    name: str
    url: str


class ProfileUpdateRequest(BaseModel):
    bio: str
    birthDate: str
    location: str
    nickname: str
    password: str | None = None
    passwordConfirmation: str | None = None
    photos: list[ProfilePhoto]


class MutationSuccessData(BaseModel):
    saved: bool = True


@dataclass(frozen=True)
class ProfileRecord:
    user_id: UUID
    nickname: str
    birth_date: date
    location: str
    bio: str


@dataclass(frozen=True)
class ProfilePhotoRecord:
    id: str
    user_id: UUID
    name: str
    url: str
    is_primary: bool
    position: int

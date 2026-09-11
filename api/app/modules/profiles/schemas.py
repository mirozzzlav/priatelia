from dataclasses import dataclass
from datetime import date
from typing import Literal
from uuid import UUID

from pydantic import BaseModel

Gender = Literal["male", "female", "unspecified"]


class ProfilePhoto(BaseModel):
    id: str
    isPrimary: bool
    name: str
    url: str


class InterestTag(BaseModel):
    id: str
    name: str


class ProfileUpdateRequest(BaseModel):
    bio: str
    birthDate: str
    gender: Gender
    interests: list[InterestTag]
    lookingFor: str = ""
    location: str
    locationLatitude: float | None = None
    locationLongitude: float | None = None
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
    email: str
    birth_date: date
    gender: Gender
    location: str
    latitude: float | None
    longitude: float | None
    bio: str
    looking_for: str | None


@dataclass(frozen=True)
class ProfilePhotoRecord:
    id: str
    user_id: UUID
    name: str
    url: str
    is_primary: bool
    position: int

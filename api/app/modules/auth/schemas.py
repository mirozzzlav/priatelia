from dataclasses import dataclass
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class RegistrationPhoto(BaseModel):
    id: str
    isPrimary: bool
    name: str
    url: str


class RegisterRequest(BaseModel):
    bio: str
    birthDate: str
    email: str
    location: str
    nickname: str
    password: str
    passwordConfirmation: str
    photos: list[RegistrationPhoto]


class LoginRequest(BaseModel):
    nickname: str
    password: str


class ActivationRequest(BaseModel):
    token: str | None = None


class UserSession(BaseModel):
    nickname: str
    token: str


class RegistrationSuccess(BaseModel):
    registered: bool = True


class AuthErrorData(BaseModel):
    errors: dict[str, str]


class AuthSuccessResponse(BaseModel):
    data: UserSession
    status: str = "success"


class AuthErrorResponse(BaseModel):
    data: AuthErrorData
    status: str = "error"


@dataclass(frozen=True)
class UserRecord:
    id: UUID
    nickname: str
    password_hash: str
    status: str


@dataclass(frozen=True)
class ActivationTokenRecord:
    token: str
    user_id: UUID
    nickname: str
    status: str
    expires_at: datetime
    used_at: datetime | None

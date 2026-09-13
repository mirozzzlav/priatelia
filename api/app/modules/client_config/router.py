from fastapi import APIRouter
from pydantic import BaseModel

from app.shared.nicknames import NICKNAME_MAX_LENGTH
from app.shared.profile_photos import MAX_PROFILE_PHOTO_COUNT
from app.shared.profile_text import BIO_MAX_LENGTH, LOOKING_FOR_MAX_LENGTH

router = APIRouter(tags=["client-config"])


class ProfileValidationConfig(BaseModel):
    bioMaxLength: int
    lookingForMaxLength: int
    nicknameMaxLength: int


class PhotoValidationConfig(BaseModel):
    maxProfilePhotoCount: int


class ValidationConfig(BaseModel):
    photos: PhotoValidationConfig
    profile: ProfileValidationConfig


class ClientConfigResponse(BaseModel):
    validation: ValidationConfig


@router.get("/client-config")
async def get_client_config() -> ClientConfigResponse:
    return ClientConfigResponse(
        validation=ValidationConfig(
            photos=PhotoValidationConfig(
                maxProfilePhotoCount=MAX_PROFILE_PHOTO_COUNT,
            ),
            profile=ProfileValidationConfig(
                bioMaxLength=BIO_MAX_LENGTH,
                lookingForMaxLength=LOOKING_FOR_MAX_LENGTH,
                nicknameMaxLength=NICKNAME_MAX_LENGTH,
            ),
        ),
    )

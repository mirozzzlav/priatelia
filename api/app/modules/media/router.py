from io import BytesIO
from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, HTTPException, UploadFile, status

from app.shared.config.settings import get_settings
from app.shared.media.client import create_media_client

router = APIRouter(tags=["media"])

allowed_content_types = {
    "image/gif": ".gif",
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}


@router.post("/media/profile-photos")
async def upload_profile_photo(file: UploadFile) -> dict[str, str]:
    content_type = file.content_type or ""
    extension = allowed_content_types.get(content_type)

    if extension is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported image type",
        )

    content = await file.read()
    if not content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Empty image",
        )

    max_size = 10 * 1024 * 1024
    if len(content) > max_size:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="Image is too large",
        )

    settings = get_settings()
    object_name = f"{uuid4()}{extension}"
    media_client = create_media_client()
    media_client.put_object(
        settings.media_bucket,
        object_name,
        BytesIO(content),
        length=len(content),
        content_type=content_type,
    )

    return {
        "name": Path(file.filename or object_name).name,
        "url": f"{settings.media_public_url.rstrip('/')}/{object_name}",
    }

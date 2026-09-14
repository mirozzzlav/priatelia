from typing import Any

from fastapi import APIRouter, Depends
from psycopg import AsyncConnection

from app.modules.feedback.repository import FeedbackRepository
from app.modules.feedback.schemas import FeedbackRequest
from app.modules.feedback.service import FeedbackService
from app.shared.auth.dependencies import CurrentUser, get_current_user
from app.shared.database.connection import get_connection
from app.shared.events.repository import EventRepository

router = APIRouter(tags=["feedback"])


@router.post("/feedback")
async def create_feedback(
    data: FeedbackRequest,
    current_user: CurrentUser = Depends(get_current_user),
    connection: AsyncConnection = Depends(get_connection),
) -> dict[str, Any]:
    service = FeedbackService(
        FeedbackRepository(connection),
        EventRepository(connection),
    )
    errors = await service.create_feedback(current_user.id, data)
    await connection.commit()

    if errors:
        return {"data": {"errors": errors}, "status": "error"}
    return {"data": {"saved": True}, "status": "success"}

from uuid import UUID

from app.modules.feedback.repository import FeedbackRepository
from app.modules.feedback.schemas import FeedbackRequest
from app.shared.events.repository import EventRepository


def validate_feedback(data: FeedbackRequest) -> tuple[dict[str, str], bool | None]:
    errors_by_field: dict[str, str] = {}
    principle_clear: bool | None = None
    normalized_principle_clear = data.principleClear.strip().lower()

    if data.overallRating is None:
        errors_by_field["overallRating"] = "Vyber hodnotenie aplikácie."
    elif data.overallRating < 1 or data.overallRating > 5:
        errors_by_field["overallRating"] = "Hodnotenie musí byť od 1 do 5."

    if normalized_principle_clear == "yes":
        principle_clear = True
    elif normalized_principle_clear == "no":
        principle_clear = False
    else:
        errors_by_field["principleClear"] = "Vyber áno alebo nie."

    if principle_clear is False and not data.unclearReason.strip():
        errors_by_field["unclearReason"] = "Napíš, čo nebolo jasné."

    return errors_by_field, principle_clear


class FeedbackService:
    def __init__(self, repository: FeedbackRepository, events: EventRepository):
        self.repository = repository
        self.events = events

    async def create_feedback(
        self,
        user_id: UUID,
        data: FeedbackRequest,
    ) -> dict[str, str]:
        errors_by_field, principle_clear = validate_feedback(data)
        if errors_by_field or principle_clear is None or data.overallRating is None:
            return errors_by_field

        await self.repository.create_feedback(
            user_id=user_id,
            overall_rating=data.overallRating,
            principle_clear=principle_clear,
            unclear_reason=data.unclearReason.strip() or None,
            improvement_suggestion=data.improvementSuggestion.strip() or None,
        )
        await self.events.append("UserFeedbackSubmitted", {"userId": str(user_id)})
        return {}

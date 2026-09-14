from pydantic import BaseModel


class FeedbackRequest(BaseModel):
    overallRating: int | None = None
    principleClear: str
    unclearReason: str = ""
    improvementSuggestion: str = ""

from uuid import UUID

from app.modules.notifications.repository import NotificationRepository


class NotificationService:
    def __init__(self, repository: NotificationRepository):
        self.repository = repository

    async def enqueue_activation_email(self, user_id: UUID, nickname: str) -> None:
        await self.repository.enqueue(
            "activation_email",
            user_id,
            {"nickname": nickname},
        )

    async def enqueue_match_notification(self, match_id: UUID, user_id: UUID) -> None:
        await self.repository.enqueue(
            "match_created",
            user_id,
            {"matchId": str(match_id)},
        )

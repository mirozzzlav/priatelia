# ruff: noqa: E501
from uuid import UUID

from app.modules.notifications.repository import (
    NotificationJobRecord,
    NotificationRepository,
)
from app.shared.config.settings import get_settings
from app.shared.mail.activation import send_activation_email
from app.shared.mail.client import MailClient


class NotificationService:
    def __init__(
        self,
        repository: NotificationRepository,
        mail: MailClient | None = None,
    ):
        self.repository = repository
        self.mail = mail or MailClient()

    async def enqueue_activation_email(
        self,
        user_id: UUID,
        email: str,
        nickname: str,
        activation_token: str,
    ) -> None:
        activation_url = f"{get_settings().web_app_url}/activate?token={activation_token}"
        await self.repository.enqueue(
            "activation_email",
            user_id,
            {
                "activationUrl": activation_url,
                "email": email,
                "nickname": nickname,
            },
        )

    async def enqueue_match_notification(self, match_id: UUID, user_id: UUID) -> None:
        await self.repository.enqueue(
            "match_created",
            user_id,
            {"matchId": str(match_id)},
        )

    async def send_job(self, job: NotificationJobRecord) -> None:
        if job.type == "activation_email":
            await self._send_activation_email(job.payload)
            return

        raise ValueError(f"Unsupported notification job type: {job.type}")

    async def _send_activation_email(self, payload: dict) -> None:
        email = str(payload.get("email", "")).strip()
        activation_url = str(payload.get("activationUrl", "")).strip()
        nickname = str(payload.get("nickname", "")).strip()

        if not email or not activation_url:
            raise ValueError("Activation email job payload is missing email or URL")

        greeting_name = nickname or "priateľ"
        await send_activation_email(
            self.mail,
            to=email,
            greeting_name=greeting_name,
            activation_url=activation_url,
        )

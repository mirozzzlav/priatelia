# ruff: noqa: E501
from uuid import UUID

from app.modules.notifications.repository import (
    NotificationJobRecord,
    NotificationRepository,
)
from app.shared.config.settings import get_settings
from app.shared.mail.client import MailClient
from app.shared.mail.templates import render_mail_template

APP_NAME = "Priatelia"
APP_LOGO_DATA_URI = (
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' "
    "viewBox='0 0 28 24' fill='none' stroke='%23ffffff' stroke-width='2' "
    "stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath "
    "d='M14 8.9a3.35 3.35 0 1 0 0-6.7 3.35 3.35 0 0 0 0 6.7z'/%3E"
    "%3Cpath d='M8.4 9.3a2.7 2.7 0 1 0 0-5.4 2.7 2.7 0 0 0 0 5.4z'/%3E"
    "%3Cpath d='M19.6 9.3a2.7 2.7 0 1 0 0-5.4 2.7 2.7 0 0 0 0 5.4z'/%3E"
    "%3Cpath d='M5.1 19.8c2-3.8 5-5.8 8.9-5.8s6.9 2 8.9 5.8'/%3E"
    "%3Cpath d='M6.8 15.9c2 2.4 4.4 3.7 7.2 3.7s5.2-1.3 7.2-3.7'/%3E"
    "%3C/svg%3E"
)


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
        await self.mail.send(
            to=email,
            subject="Aktivuj si účet Priatelia",
            body=(
                f"Ahoj {greeting_name.lower()}, aktivuj si účet.\n\n"
                "Klikni na tento odkaz:\n"
                f"{activation_url}\n\n"
                "Link platí 24 hodín."
            ),
            html_body=_render_activation_email_html(greeting_name, activation_url),
        )


def _render_activation_email_html(greeting_name: str, activation_url: str) -> str:
    return render_mail_template(
        "activation.html",
        activation_url=activation_url,
        app_name=APP_NAME,
        greeting_name=greeting_name.lower(),
        logo_url=APP_LOGO_DATA_URI,
        subject_text="aktivuj si účet",
        title="Aktivuj si účet.",
    )

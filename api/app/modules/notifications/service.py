# ruff: noqa: E501
from html import escape
from uuid import UUID

from app.modules.notifications.repository import (
    NotificationJobRecord,
    NotificationRepository,
)
from app.shared.config.settings import get_settings
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
        await self.mail.send(
            to=email,
            subject="Aktivuj si účet Priatelia",
            body=(
                f"Ahoj {greeting_name},\n\n"
                "klikni na tento odkaz a aktivuj si účet:\n"
                f"{activation_url}\n\n"
                "Link platí 24 hodín."
            ),
            html_body=_render_activation_email_html(greeting_name, activation_url),
        )


def _render_activation_email_html(greeting_name: str, activation_url: str) -> str:
    safe_name = escape(greeting_name)
    safe_url = escape(activation_url, quote=True)

    return f"""<!doctype html>
<html lang="sk">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Aktivuj si účet Priatelia</title>
  </head>
  <body style="margin:0; padding:0; background:#f4f0ea; font-family:Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color:#171717;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f0ea; margin:0; padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px; background:#ffffff; border:1px solid #e7d9c8; border-radius:18px; overflow:hidden;">
            <tr>
              <td style="background:#26396f; padding:26px 28px;">
                <div style="color:#ffa633; font-size:13px; font-weight:800; letter-spacing:0; text-transform:uppercase;">Priatelia</div>
                <h1 style="margin:8px 0 0; color:#ffffff; font-size:28px; line-height:1.15; font-weight:700;">Aktivuj si účet</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:30px 28px 10px;">
                <p style="margin:0 0 16px; font-size:17px; line-height:1.55;">Ahoj {safe_name},</p>
                <p style="margin:0; font-size:16px; line-height:1.6; color:#333333;">stačí jedno kliknutie a tvoj účet bude pripravený na objavovanie nových ľudí.</p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:22px 28px 26px;">
                <a href="{safe_url}" style="display:inline-block; background:#3b5a9d; color:#ffffff; text-decoration:none; padding:15px 24px; border-radius:999px; font-size:16px; font-weight:800;">Aktivovať účet</a>
              </td>
            </tr>
            <tr>
              <td style="padding:0 28px 28px;">
                <p style="margin:0 0 12px; font-size:14px; line-height:1.55; color:#654a26;">Link platí 24 hodín.</p>
                <p style="margin:0; font-size:13px; line-height:1.55; color:#666666;">Ak tlačidlo nefunguje, skopíruj tento odkaz do prehliadača:<br><a href="{safe_url}" style="color:#3b5a9d; word-break:break-all;">{safe_url}</a></p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>"""

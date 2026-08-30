from email.message import EmailMessage

import aiosmtplib

from app.shared.config.settings import get_settings


class MailClient:
    async def send(self, to: str, subject: str, body: str) -> None:
        settings = get_settings()
        message = EmailMessage()
        message["From"] = settings.smtp_from
        message["To"] = to
        message["Subject"] = subject
        message.set_content(body)

        await aiosmtplib.send(
            message,
            hostname=settings.smtp_host,
            port=settings.smtp_port,
        )

from email.message import EmailMessage

import aiosmtplib

from app.shared.config.settings import get_settings


class MailClient:
    async def send(
        self,
        to: str,
        subject: str,
        body: str,
        html_body: str | None = None,
    ) -> None:
        settings = get_settings()
        message = EmailMessage()
        message["From"] = settings.smtp_from
        message["To"] = to
        message["Subject"] = subject
        message.set_content(body)
        if html_body:
            message.add_alternative(html_body, subtype="html")

        await aiosmtplib.send(
            message,
            hostname=settings.smtp_host,
            port=settings.smtp_port,
        )

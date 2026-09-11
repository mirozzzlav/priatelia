from app.shared.config.settings import get_settings
from app.shared.mail.client import MailClient
from app.shared.mail.templates import render_mail_template

APP_NAME = "Priatelia"
ACTIVATION_EMAIL_SUBJECT = f"Aktivuj si účet {APP_NAME}"


def render_activation_email_html(
    greeting_name: str,
    activation_url: str,
    logo_url: str | None = None,
) -> str:
    if logo_url is None:
        logo_url = f"{get_settings().web_app_url.rstrip('/')}/email-logo.png"

    return render_mail_template(
        "activation.html",
        activation_url=activation_url,
        app_name=APP_NAME,
        greeting_name=greeting_name.lower(),
        logo_url=logo_url,
        subject_text="aktivuj si účet",
        title="Aktivuj si účet.",
    )


def render_activation_email_text(greeting_name: str, activation_url: str) -> str:
    return (
        f"Ahoj {greeting_name.lower()}, aktivuj si účet.\n\n"
        "Klikni na tento odkaz:\n"
        f"{activation_url}\n\n"
        "Link platí 24 hodín."
    )


async def send_activation_email(
    mail: MailClient,
    to: str,
    greeting_name: str,
    activation_url: str,
) -> None:
    await mail.send(
        to=to,
        subject=ACTIVATION_EMAIL_SUBJECT,
        body=render_activation_email_text(greeting_name, activation_url),
        html_body=render_activation_email_html(greeting_name, activation_url),
    )

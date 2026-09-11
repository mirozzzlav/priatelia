import argparse
import asyncio
import os
import sys
from pathlib import Path

API_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(API_DIR))

from app.shared.config.settings import get_settings  # noqa: E402
from app.shared.mail.activation import send_activation_email  # noqa: E402
from app.shared.mail.client import MailClient  # noqa: E402


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Send an activation email preview to local Mailpit."
    )
    parser.add_argument(
        "--to",
        default="preview@priatelia.test",
        help="Recipient address for the preview email.",
    )
    parser.add_argument(
        "--nickname",
        default="Mirko",
        help="Nickname used in the preview greeting.",
    )
    parser.add_argument(
        "--activation-url",
        help=(
            "Activation URL used in the preview email. Defaults to "
            "WEB_APP_URL with a preview token."
        ),
    )
    return parser.parse_args()


async def main() -> None:
    args = parse_args()
    os.environ["SMTP_HOST"] = "mailpit"
    os.environ["SMTP_USERNAME"] = ""
    os.environ["SMTP_PASSWORD"] = ""
    os.environ["SMTP_STARTTLS"] = "false"
    os.environ["SMTP_USE_TLS"] = "false"

    settings = get_settings()
    greeting_name = args.nickname or "priateľ"
    activation_url = (
        args.activation_url.strip()
        if args.activation_url
        else f"{settings.web_app_url.rstrip('/')}/activate?token=preview-token"
    )

    await send_activation_email(
        MailClient(),
        to=args.to,
        greeting_name=greeting_name,
        activation_url=activation_url,
    )
    print(f"Sent activation email preview to {args.to}")


if __name__ == "__main__":
    asyncio.run(main())

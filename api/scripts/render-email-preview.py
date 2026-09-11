import base64
import sys
from pathlib import Path

API_DIR = Path(__file__).resolve().parents[1]
PROJECT_DIR = API_DIR.parent
sys.path.insert(0, str(API_DIR))

from app.modules.notifications.service import (  # noqa: E402
    _render_activation_email_html,
)

OUTPUT_DIR = API_DIR / "email-previews"


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    activation_preview = _render_activation_email_html(
        "Mirko",
        "https://priatelia.local/activate?token=preview-token",
        logo_url=(
            "data:image/png;base64,"
            + base64.b64encode(
                (PROJECT_DIR / "web/public/email-logo.png").read_bytes()
            ).decode("ascii")
        ),
    )
    (OUTPUT_DIR / "activation.html").write_text(
        activation_preview,
        encoding="utf-8",
    )
    print(OUTPUT_DIR / "activation.html")


if __name__ == "__main__":
    main()

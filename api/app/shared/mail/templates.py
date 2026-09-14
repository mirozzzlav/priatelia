from functools import lru_cache
from pathlib import Path
from typing import Any

from jinja2 import Environment, FileSystemLoader, select_autoescape

TEMPLATES_DIR = Path(__file__).with_name("templates")

MAIL_THEME = {
    "colors": {
        "app": {
            "base": "#4f8344",
            "baseDark": "#35572d",
            "borderColorStrong": "rgba(53, 87, 45, 0.28)",
            "info": "#c56a18",
            "white": "#ffffff",
            "text": "#000000",
        },
    },
}


@lru_cache
def get_mail_template_environment() -> Environment:
    return Environment(
        loader=FileSystemLoader(TEMPLATES_DIR),
        autoescape=select_autoescape(("html", "xml")),
    )


def render_mail_template(template_name: str, **context: Any) -> str:
    template = get_mail_template_environment().get_template(template_name)
    return template.render(mail_theme=MAIL_THEME, **context)

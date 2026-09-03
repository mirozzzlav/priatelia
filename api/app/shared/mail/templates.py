from functools import lru_cache
from pathlib import Path
from typing import Any

from jinja2 import Environment, FileSystemLoader, select_autoescape

TEMPLATES_DIR = Path(__file__).with_name("templates")


@lru_cache
def get_mail_template_environment() -> Environment:
    return Environment(
        loader=FileSystemLoader(TEMPLATES_DIR),
        autoescape=select_autoescape(("html", "xml")),
    )


def render_mail_template(template_name: str, **context: Any) -> str:
    template = get_mail_template_environment().get_template(template_name)
    return template.render(**context)

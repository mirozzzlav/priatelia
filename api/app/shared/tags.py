import re
import unicodedata


def normalize_tag_id(value: str) -> str:
    ascii_value = (
        unicodedata.normalize("NFKD", value.strip())
        .encode("ascii", "ignore")
        .decode("ascii")
    )
    normalized = re.sub(r"[^a-z0-9]+", "_", ascii_value.lower())
    return normalized.strip("_")

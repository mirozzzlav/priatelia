import json
from functools import lru_cache
from pathlib import Path

type InterestTag = dict[str, str]


def _catalog_path() -> Path:
    current_path = Path(__file__).resolve()
    for parent in current_path.parents:
        catalog_path = parent / "shared" / "interest-tags.json"
        if catalog_path.exists():
            return catalog_path
    raise FileNotFoundError("shared/interest-tags.json was not found")


@lru_cache
def list_interest_tags() -> tuple[InterestTag, ...]:
    tags = json.loads(_catalog_path().read_text(encoding="utf-8"))
    return tuple({"id": tag["id"], "name": tag["name"]} for tag in tags)


@lru_cache
def get_interest_tag_map() -> dict[str, str]:
    return {tag["id"]: tag["name"] for tag in list_interest_tags()}


def search_interest_tags(query: str, limit: int = 12) -> list[InterestTag]:
    normalized_query = query.strip().casefold()
    matches = [
        tag
        for tag in list_interest_tags()
        if not normalized_query
        or normalized_query in tag["id"].casefold()
        or normalized_query in tag["name"].casefold()
    ]
    return sorted(matches, key=lambda tag: tag["name"].casefold())[:limit]


def list_known_interest_ids(interest_ids: list[str]) -> set[str]:
    tag_map = get_interest_tag_map()
    return {interest_id for interest_id in interest_ids if interest_id in tag_map}


def resolve_interest_tags(interest_ids: list[str] | None) -> list[InterestTag]:
    if not interest_ids:
        return []

    tag_map = get_interest_tag_map()
    return [
        {"id": interest_id, "name": tag_map[interest_id]}
        for interest_id in interest_ids
        if interest_id in tag_map
    ]

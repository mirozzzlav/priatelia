import asyncio
import json
import time
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from app.modules.locations.schemas import LocationOption
from app.shared.geo import (
    get_location_dedupe_key,
    get_location_label,
    get_nominatim_result_priority,
    is_allowed_nominatim_result,
)

NOMINATIM_SEARCH_URL = "https://nominatim.openstreetmap.org/search"
USER_AGENT = "Priatelia/0.1 location-search"
REFERER = "http://localhost:4444"

_cache: dict[str, list[LocationOption]] = {}
_lock = asyncio.Lock()
_last_request_started_at = 0.0


async def search_locations(query: str) -> list[LocationOption]:
    normalized_query = query.strip()
    if len(normalized_query) < 3:
        return []

    cache_key = normalized_query.casefold()
    cached_options = _cache.get(cache_key)
    if cached_options is not None:
        return cached_options

    async with _lock:
        cached_options = _cache.get(cache_key)
        if cached_options is not None:
            return cached_options

        await _wait_for_rate_limit()
        results = await asyncio.to_thread(_fetch_nominatim_results, normalized_query)
        options = _dedupe_results(results)
        _cache[cache_key] = options
        return options


async def _wait_for_rate_limit() -> None:
    global _last_request_started_at

    now = time.monotonic()
    wait_seconds = max(0.0, 1.1 - (now - _last_request_started_at))
    if wait_seconds > 0:
        await asyncio.sleep(wait_seconds)

    _last_request_started_at = time.monotonic()


def _fetch_nominatim_results(query: str) -> list[dict]:
    params = urlencode(
        {
            "addressdetails": "1",
            "countrycodes": "sk",
            "format": "jsonv2",
            "layer": "address",
            "limit": "6",
            "q": query,
        }
    )
    request = Request(
        f"{NOMINATIM_SEARCH_URL}?{params}",
        headers={
            "Accept": "application/json",
            "Referer": REFERER,
            "User-Agent": USER_AGENT,
        },
    )

    with urlopen(request, timeout=5) as response:
        payload = response.read().decode("utf-8")

    data = json.loads(payload)
    return data if isinstance(data, list) else []


def _dedupe_results(results: list[dict]) -> list[LocationOption]:
    options_by_key: dict[str, tuple[int, LocationOption]] = {}

    for result in results:
        if not is_allowed_nominatim_result(result):
            continue

        try:
            latitude = float(result["lat"])
            longitude = float(result["lon"])
        except (KeyError, TypeError, ValueError):
            continue

        label = get_location_label(result)
        option = LocationOption(
            id=f"{result.get('lat')}-{result.get('lon')}-{result.get('display_name')}",
            label=label,
            latitude=latitude,
            longitude=longitude,
        )
        priority = get_nominatim_result_priority(result)
        key = get_location_dedupe_key(label, latitude, longitude)
        current = options_by_key.get(key)

        if current is None or priority < current[0]:
            options_by_key[key] = (priority, option)

    return [option for _, option in options_by_key.values()]

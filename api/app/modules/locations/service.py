import asyncio
import json
import time
import unicodedata
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
MIN_LOCATION_SEARCH_LENGTH = 3
MAX_LOCATION_OPTIONS = 6

LOCAL_LOCATION_OPTIONS = [
    LocationOption(
        id="bratislava",
        label="Bratislava, Slovensko",
        latitude=48.1486,
        longitude=17.1077,
    ),
    LocationOption(
        id="bratislava-petrzalka",
        label="Bratislava-Petržalka, Bratislava, Slovensko",
        latitude=48.111,
        longitude=17.1113,
    ),
    LocationOption(
        id="kosice",
        label="Košice, Slovensko",
        latitude=48.7164,
        longitude=21.2611,
    ),
    LocationOption(
        id="presov",
        label="Prešov, Slovensko",
        latitude=49.0018,
        longitude=21.2393,
    ),
    LocationOption(
        id="zilina",
        label="Žilina, Slovensko",
        latitude=49.2232,
        longitude=18.7394,
    ),
    LocationOption(
        id="nitra",
        label="Nitra, Slovensko",
        latitude=48.3061,
        longitude=18.0764,
    ),
    LocationOption(
        id="banska-bystrica",
        label="Banská Bystrica, Slovensko",
        latitude=48.7363,
        longitude=19.1462,
    ),
    LocationOption(
        id="banska-stiavnica",
        label="Banská Štiavnica, Slovensko",
        latitude=48.4586,
        longitude=18.8962,
    ),
    LocationOption(
        id="trnava",
        label="Trnava, Slovensko",
        latitude=48.3774,
        longitude=17.5872,
    ),
    LocationOption(
        id="trencin",
        label="Trenčín, Slovensko",
        latitude=48.8945,
        longitude=18.0444,
    ),
    LocationOption(
        id="martin",
        label="Martin, Slovensko",
        latitude=49.0665,
        longitude=18.9239,
    ),
    LocationOption(
        id="poprad",
        label="Poprad, Slovensko",
        latitude=49.0598,
        longitude=20.2975,
    ),
    LocationOption(
        id="prievidza",
        label="Prievidza, Slovensko",
        latitude=48.7745,
        longitude=18.6275,
    ),
    LocationOption(
        id="zvolen",
        label="Zvolen, Slovensko",
        latitude=48.5762,
        longitude=19.1371,
    ),
    LocationOption(
        id="nove-zamky",
        label="Nové Zámky, Slovensko",
        latitude=47.9854,
        longitude=18.1619,
    ),
    LocationOption(
        id="michalovce",
        label="Michalovce, Slovensko",
        latitude=48.7543,
        longitude=21.9195,
    ),
    LocationOption(
        id="spisska-nova-ves",
        label="Spišská Nová Ves, Slovensko",
        latitude=48.9446,
        longitude=20.5615,
    ),
    LocationOption(
        id="komarno",
        label="Komárno, Slovensko",
        latitude=47.7636,
        longitude=18.1226,
    ),
    LocationOption(
        id="levice",
        label="Levice, Slovensko",
        latitude=48.2156,
        longitude=18.6071,
    ),
    LocationOption(
        id="bardejov",
        label="Bardejov, Slovensko",
        latitude=49.2926,
        longitude=21.2756,
    ),
    LocationOption(
        id="liptovsky-mikulas",
        label="Liptovský Mikuláš, Slovensko",
        latitude=49.0842,
        longitude=19.6022,
    ),
    LocationOption(
        id="piestany",
        label="Piešťany, Slovensko",
        latitude=48.5948,
        longitude=17.8259,
    ),
    LocationOption(
        id="lucenec",
        label="Lučenec, Slovensko",
        latitude=48.3325,
        longitude=19.6671,
    ),
    LocationOption(
        id="pezinok",
        label="Pezinok, Slovensko",
        latitude=48.2899,
        longitude=17.2666,
    ),
    LocationOption(
        id="senec",
        label="Senec, Slovensko",
        latitude=48.2195,
        longitude=17.4004,
    ),
]

_cache: dict[str, list[LocationOption]] = {}
_lock = asyncio.Lock()
_last_request_started_at = 0.0


async def search_locations(query: str) -> list[LocationOption]:
    normalized_query = query.strip()
    if len(normalized_query) < MIN_LOCATION_SEARCH_LENGTH:
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
        options = _merge_location_options(
            _get_local_location_options(normalized_query),
            _dedupe_results(results),
        )
        _cache[cache_key] = options
        return options


def _normalize_search_text(value: str) -> str:
    without_accents = unicodedata.normalize("NFKD", value)
    return "".join(
        character
        for character in without_accents
        if not unicodedata.combining(character)
    ).casefold()


def _get_local_location_options(query: str) -> list[LocationOption]:
    normalized_query = _normalize_search_text(query)

    def get_score(option: LocationOption) -> tuple[int, str]:
        normalized_label = _normalize_search_text(option.label)
        normalized_city = normalized_label.split(",", 1)[0]

        if normalized_city.startswith(normalized_query):
            return (0, option.label)
        if normalized_label.startswith(normalized_query):
            return (1, option.label)
        return (2, option.label)

    return sorted(
        (
            option
            for option in LOCAL_LOCATION_OPTIONS
            if normalized_query in _normalize_search_text(option.label)
        ),
        key=get_score,
    )


def _merge_location_options(
    local_options: list[LocationOption],
    remote_options: list[LocationOption],
) -> list[LocationOption]:
    merged_options: list[LocationOption] = []
    seen_keys: set[str] = set()

    for option in [*local_options, *remote_options]:
        key = get_location_dedupe_key(option.label, option.latitude, option.longitude)
        label_key = _normalize_search_text(option.label)
        if key in seen_keys or label_key in seen_keys:
            continue

        seen_keys.add(key)
        seen_keys.add(label_key)
        merged_options.append(option)

        if len(merged_options) >= MAX_LOCATION_OPTIONS:
            break

    return merged_options


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

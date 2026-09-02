from dataclasses import dataclass
from typing import Any
from unicodedata import normalize


@dataclass(frozen=True)
class Coordinates:
    latitude: float
    longitude: float


KNOWN_LOCATION_COORDINATES = {
    "bratislava": Coordinates(latitude=48.1486, longitude=17.1077),
    "brno": Coordinates(latitude=49.1951, longitude=16.6068),
    "levice": Coordinates(latitude=48.2156, longitude=18.6071),
    "nitra": Coordinates(latitude=48.3061, longitude=18.0764),
    "trnava": Coordinates(latitude=48.3774, longitude=17.5872),
}


def normalize_location(value: str) -> str:
    without_accents = normalize("NFKD", value).encode("ascii", "ignore")
    return without_accents.decode("ascii").strip().lower()


def resolve_coordinates(
    location: str,
    latitude: float | None = None,
    longitude: float | None = None,
) -> Coordinates | None:
    if latitude is not None and longitude is not None:
        return Coordinates(latitude=latitude, longitude=longitude)

    normalized_location = normalize_location(location)
    for known_location, coordinates in KNOWN_LOCATION_COORDINATES.items():
        if known_location in normalized_location:
            return coordinates

    return None


def coordinates_are_valid(latitude: float | None, longitude: float | None) -> bool:
    if latitude is None and longitude is None:
        return True
    if latitude is None or longitude is None:
        return False
    return -90 <= latitude <= 90 and -180 <= longitude <= 180


ALLOWED_NOMINATIM_ADDRESS_TYPES = {
    "borough",
    "city",
    "city_district",
    "hamlet",
    "municipality",
    "neighbourhood",
    "quarter",
    "suburb",
    "town",
    "village",
}


def get_location_label(result: dict[str, Any]) -> str:
    address = result.get("address") or {}
    display_name = str(result.get("display_name") or "")
    primary = (
        result.get("name")
        or address.get("city_district")
        or address.get("suburb")
        or address.get("borough")
        or address.get("neighbourhood")
        or address.get("quarter")
        or address.get("city")
        or address.get("town")
        or address.get("village")
        or address.get("municipality")
        or display_name.split(",")[0]
        or display_name
    )
    parent = (
        address.get("city")
        or address.get("town")
        or address.get("village")
        or address.get("municipality")
        or address.get("county")
        or ""
    )
    country = address.get("country") or ""
    label_parts = []
    for part in [primary, parent, country]:
        if part and part not in label_parts:
            label_parts.append(part)

    return ", ".join(label_parts)


def is_allowed_nominatim_result(result: dict[str, Any]) -> bool:
    address_type = result.get("addresstype")
    if address_type in ALLOWED_NOMINATIM_ADDRESS_TYPES:
        return True

    address = result.get("address") or {}
    return any(
        address.get(key)
        for key in [
            "borough",
            "city",
            "city_district",
            "hamlet",
            "municipality",
            "neighbourhood",
            "quarter",
            "suburb",
            "town",
            "village",
        ]
    )


def get_nominatim_result_priority(result: dict[str, Any]) -> int:
    if result.get("category") == "boundary" and result.get("type") == "administrative":
        return 0
    if result.get("osm_type") == "relation":
        return 1
    if result.get("category") == "place":
        return 2
    return 3


def get_location_dedupe_key(label: str, latitude: float, longitude: float) -> str:
    return "|".join(
        [
            normalize_location(label),
            f"{latitude:.4f}",
            f"{longitude:.4f}",
        ]
    )

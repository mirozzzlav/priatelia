from app.modules.discovery.repository import DiscoveryRepository
from app.modules.discovery.schemas import DiscoverySettingsRequest
from app.shared.events.repository import EventRepository
from app.shared.geo import coordinates_are_valid, resolve_coordinates


def validate_settings(
    data: DiscoverySettingsRequest,
) -> tuple[dict[str, str], int, int, int]:
    errors_by_field: dict[str, str] = {}
    age_from = 0
    age_to = 0
    radius_km = 0

    if not data.location.strip():
        errors_by_field["location"] = "Vyplň lokalitu."
    elif not coordinates_are_valid(data.locationLatitude, data.locationLongitude):
        errors_by_field["location"] = "Lokalita nemá platné súradnice."

    try:
        age_from = int(data.ageFrom)
    except ValueError:
        errors_by_field["ageFrom"] = "Vek od musí byť celé číslo."

    try:
        age_to = int(data.ageTo)
    except ValueError:
        errors_by_field["ageTo"] = "Vek do musí byť celé číslo."

    try:
        radius_km = int(data.radiusKm)
    except ValueError:
        errors_by_field["radiusKm"] = "Radius musí byť celé číslo."

    if "ageFrom" not in errors_by_field and age_from < 18:
        errors_by_field["ageFrom"] = "Vek od musí byť aspoň 18."
    if "ageTo" not in errors_by_field and age_to < age_from:
        errors_by_field["ageTo"] = "Vek do nemôže byť menší ako vek od."
    if "radiusKm" not in errors_by_field and not 1 <= radius_km <= 500:
        errors_by_field["radiusKm"] = "Radius musí byť od 1 do 500 km."

    return errors_by_field, age_from, age_to, radius_km


class DiscoveryService:
    def __init__(self, repository: DiscoveryRepository, events: EventRepository):
        self.repository = repository
        self.events = events

    async def update_settings(
        self,
        user_id,
        data: DiscoverySettingsRequest,
    ) -> dict[str, str]:
        errors_by_field, age_from, age_to, radius_km = validate_settings(data)
        if errors_by_field:
            return errors_by_field

        coordinates = resolve_coordinates(
            data.location.strip(),
            data.locationLatitude,
            data.locationLongitude,
        )
        await self.repository.upsert_settings(
            user_id=user_id,
            age_from=age_from,
            age_to=age_to,
            location=data.location.strip(),
            latitude=coordinates.latitude if coordinates else None,
            longitude=coordinates.longitude if coordinates else None,
            radius_km=radius_km,
        )
        await self.events.append("DiscoverySettingsUpdated", {"userId": str(user_id)})
        return {}

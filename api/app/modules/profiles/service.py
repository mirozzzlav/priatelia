from app.modules.profiles.repository import ProfileRepository
from app.modules.profiles.schemas import ProfileUpdateRequest
from app.shared.events.repository import EventRepository
from app.shared.geo import coordinates_are_valid, resolve_coordinates
from app.shared.tags import normalize_tag_id


def _word_count(value: str) -> int:
    return len(value.strip().split())


def validate_profile(data: ProfileUpdateRequest) -> dict[str, str]:
    errors_by_field: dict[str, str] = {}

    if not data.nickname.strip():
        errors_by_field["nickname"] = "Vyplň nickname."
    if not data.birthDate:
        errors_by_field["birthDate"] = "Vyplň dátum narodenia."
    if not data.location.strip():
        errors_by_field["location"] = "Vyplň svoju lokalitu."
    elif not coordinates_are_valid(data.locationLatitude, data.locationLongitude):
        errors_by_field["location"] = "Poloha nemá platné súradnice."
    if _word_count(data.bio) == 0:
        errors_by_field["bio"] = "Vyplň krátke bio."
    elif _word_count(data.bio) < 3:
        errors_by_field["bio"] = "Bio musí obsahovať aspoň 3 slová."
    if not data.interests:
        errors_by_field["interests"] = "Pridaj aspoň jeden záujem."
    if not data.photos:
        errors_by_field["photos"] = "Pridaj aspoň jednu fotku."

    return errors_by_field


class ProfileService:
    def __init__(self, repository: ProfileRepository, events: EventRepository):
        self.repository = repository
        self.events = events

    async def update_profile(
        self, user_id, data: ProfileUpdateRequest
    ) -> dict[str, str]:
        errors_by_field = validate_profile(data)
        if errors_by_field:
            return errors_by_field

        interest_ids = list(dict.fromkeys(interest.id for interest in data.interests))
        if any(
            normalize_tag_id(interest.name) != interest.id
            for interest in data.interests
        ):
            return {"interests": "Vyber záujmy zo zoznamu."}

        known_interest_ids = await self.repository.list_known_interest_ids(interest_ids)
        if any(interest_id not in known_interest_ids for interest_id in interest_ids):
            return {"interests": "Vyber záujmy zo zoznamu."}

        if await self.repository.is_nickname_used_by_another_user(
            user_id,
            data.nickname.strip(),
        ):
            return {"nickname": "Tento nickname je už obsadený."}

        coordinates = resolve_coordinates(
            data.location.strip(),
            data.locationLatitude,
            data.locationLongitude,
        )
        await self.repository.update_profile(
            user_id=user_id,
            nickname=data.nickname.strip(),
            birth_date=data.birthDate,
            location=data.location.strip(),
            latitude=coordinates.latitude if coordinates else None,
            longitude=coordinates.longitude if coordinates else None,
            bio=data.bio.strip(),
            interest_ids=interest_ids,
            photos=data.photos,
        )

        await self.events.append("ProfileUpdated", {"userId": str(user_id)})
        return {}

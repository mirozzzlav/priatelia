from app.modules.profiles.repository import ProfileRepository
from app.modules.profiles.schemas import ProfileUpdateRequest
from app.shared.events.repository import EventRepository


def _word_count(value: str) -> int:
    return len(value.strip().split())


def validate_profile(data: ProfileUpdateRequest) -> dict[str, str]:
    errors_by_field: dict[str, str] = {}

    if not data.nickname.strip():
        errors_by_field["nickname"] = "Vyplň nickname."
    if not data.birthDate:
        errors_by_field["birthDate"] = "Vyplň dátum narodenia."
    if not data.location.strip():
        errors_by_field["location"] = "Vyplň polohu pre hľadanie priateľov."
    if _word_count(data.bio) == 0:
        errors_by_field["bio"] = "Vyplň krátke bio."
    elif _word_count(data.bio) < 3:
        errors_by_field["bio"] = "Bio musí obsahovať aspoň 3 slová."
    if not data.photos:
        errors_by_field["photos"] = "Pridaj aspoň jednu fotku."

    return errors_by_field


class ProfileService:
    def __init__(self, repository: ProfileRepository, events: EventRepository):
        self.repository = repository
        self.events = events

    async def update_profile(self, user_id, data: ProfileUpdateRequest) -> dict[str, str]:
        errors_by_field = validate_profile(data)
        if errors_by_field:
            return errors_by_field

        if await self.repository.is_nickname_used_by_another_user(
            user_id,
            data.nickname.strip(),
        ):
            return {"nickname": "Tento nickname je už obsadený."}

        await self.repository.update_profile(
            user_id=user_id,
            nickname=data.nickname.strip(),
            birth_date=data.birthDate,
            location=data.location.strip(),
            bio=data.bio.strip(),
            photos=data.photos,
        )

        await self.events.append("ProfileUpdated", {"userId": str(user_id)})
        return {}

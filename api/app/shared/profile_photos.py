MAX_PROFILE_PHOTO_COUNT = 7


def validate_profile_photos(photos) -> str | None:
    if not photos:
        return "Pridaj aspoň jednu fotku."

    if len(photos) > MAX_PROFILE_PHOTO_COUNT:
        return "Môžeš mať najviac 1 profilovú a 6 ďalších fotiek."

    if sum(1 for photo in photos if photo.isPrimary) > 1:
        return "Profilová fotka môže byť najviac jedna."

    return None

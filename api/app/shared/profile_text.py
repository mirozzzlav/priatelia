BIO_MAX_LENGTH = 500
LOOKING_FOR_MAX_LENGTH = 300


def validate_profile_text_lengths(bio: str, looking_for: str) -> dict[str, str]:
    errors_by_field: dict[str, str] = {}

    if len(bio) > BIO_MAX_LENGTH:
        errors_by_field["bio"] = f"Bio môže mať najviac {BIO_MAX_LENGTH} znakov."

    if len(looking_for) > LOOKING_FOR_MAX_LENGTH:
        errors_by_field["lookingFor"] = (
            f"Čo hľadám môže mať najviac {LOOKING_FOR_MAX_LENGTH} znakov."
        )

    return errors_by_field

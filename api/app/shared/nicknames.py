NICKNAME_MAX_LENGTH = 15

INVALID_NICKNAME_MESSAGE = (
    f"Nickname môže mať najviac {NICKNAME_MAX_LENGTH} znakov a obsahovať iba "
    "písmená a číslice bez medzier."
)


def is_valid_nickname(value: str) -> bool:
    nickname = value.strip()
    return 0 < len(nickname) <= NICKNAME_MAX_LENGTH and nickname.isalnum()

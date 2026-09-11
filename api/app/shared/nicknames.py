INVALID_NICKNAME_MESSAGE = (
    "Nickname môže obsahovať iba písmená a číslice bez medzier."
)


def is_valid_nickname(value: str) -> bool:
    return value.strip().isalnum()

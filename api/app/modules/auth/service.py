import re
import secrets
from datetime import UTC, datetime, timedelta
from typing import Any

from app.modules.auth.repository import AuthRepository
from app.modules.auth.schemas import (
    ActivationRequest,
    LoginRequest,
    RegisterRequest,
    RegistrationSuccess,
    UserSession,
)
from app.modules.notifications.service import NotificationService
from app.shared.auth.passwords import hash_password, verify_password
from app.shared.auth.tokens import create_access_token
from app.shared.events.repository import EventRepository
from app.shared.tags import normalize_tag_id


def _word_count(value: str) -> int:
    return len(value.strip().split())


def _is_valid_email(value: str) -> bool:
    return bool(re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", value.strip()))


def validate_registration(data: RegisterRequest) -> dict[str, str]:
    errors_by_field: dict[str, str] = {}

    if not data.nickname.strip():
        errors_by_field["nickname"] = "Vyplň nickname."
    if not data.email.strip():
        errors_by_field["email"] = "Vyplň email."
    elif not _is_valid_email(data.email):
        errors_by_field["email"] = "Email nemá správny formát."
    if not data.password:
        errors_by_field["password"] = "Vyplň heslo."
    elif len(data.password) < 8:
        errors_by_field["password"] = "Heslo musí mať aspoň 8 znakov."
    if not data.passwordConfirmation:
        errors_by_field["passwordConfirmation"] = "Zopakuj heslo."
    elif data.password != data.passwordConfirmation:
        errors_by_field["passwordConfirmation"] = "Heslá sa nezhodujú."
    if not data.birthDate:
        errors_by_field["birthDate"] = "Vyplň dátum narodenia."
    if not data.location.strip():
        errors_by_field["location"] = "Vyplň polohu pre hľadanie priateľov."
    if _word_count(data.bio) == 0:
        errors_by_field["bio"] = "Vyplň krátke bio."
    elif _word_count(data.bio) < 3:
        errors_by_field["bio"] = "Bio musí obsahovať aspoň 3 slová."
    if not data.interests:
        errors_by_field["interests"] = "Pridaj aspoň jeden záujem."
    if not data.photos:
        errors_by_field["photos"] = "Pridaj aspoň jednu fotku."

    return errors_by_field


class AuthService:
    def __init__(
        self,
        repository: AuthRepository,
        events: EventRepository,
        notifications: NotificationService,
    ):
        self.repository = repository
        self.events = events
        self.notifications = notifications

    async def register(
        self, data: RegisterRequest
    ) -> RegistrationSuccess | dict[str, Any]:
        validation_errors = validate_registration(data)
        if validation_errors:
            return {"errors": validation_errors}

        interest_ids = list(dict.fromkeys(interest.id for interest in data.interests))
        if any(
            normalize_tag_id(interest.name) != interest.id
            for interest in data.interests
        ):
            return {"errors": {"interests": "Vyber záujmy zo zoznamu."}}

        known_interest_ids = await self.repository.list_known_interest_ids(interest_ids)
        if any(interest_id not in known_interest_ids for interest_id in interest_ids):
            return {"errors": {"interests": "Vyber záujmy zo zoznamu."}}

        existing_user = await self.repository.get_user_by_nickname(
            data.nickname.strip()
        )
        if existing_user is not None:
            return {"errors": {"nickname": "Tento nickname je už obsadený."}}

        existing_email_user = await self.repository.get_user_by_email(
            data.email.strip()
        )
        if existing_email_user is not None:
            return {"errors": {"email": "Tento email je už použitý."}}

        user = await self.repository.create_user(
            nickname=data.nickname.strip(),
            email=data.email.strip(),
            password_hash=hash_password(data.password),
        )
        await self.repository.create_profile(
            user_id=user.id,
            birth_date=data.birthDate,
            location=data.location.strip(),
            bio=data.bio.strip(),
            interest_ids=interest_ids,
            photos=data.photos,
        )
        await self.repository.create_default_discovery_settings(
            user_id=user.id,
            location=data.location.strip(),
        )
        activation_token = secrets.token_urlsafe(32)
        await self.repository.create_activation_token(
            user_id=user.id,
            token=activation_token,
            expires_at=datetime.now(UTC) + timedelta(hours=24),
        )
        await self.events.append(
            "UserRegistered",
            {"userId": str(user.id), "nickname": user.nickname},
        )
        await self.notifications.enqueue_activation_email(
            user_id=user.id,
            email=data.email.strip(),
            nickname=user.nickname,
            activation_token=activation_token,
        )

        return RegistrationSuccess()

    async def login(self, data: LoginRequest) -> UserSession | dict[str, Any]:
        user = await self.repository.get_user_by_nickname(data.nickname.strip())

        if user is None or not verify_password(data.password, user.password_hash):
            return {
                "errors": {
                    "nickname": "Nesprávna kombinácia mena a hesla.",
                    "password": "Nesprávna kombinácia mena a hesla.",
                }
            }

        if user.status != "active":
            return {
                "errors": {
                    "nickname": "Účet ešte nie je aktivovaný.",
                    "password": "Účet ešte nie je aktivovaný.",
                }
            }

        return UserSession(
            nickname=user.nickname,
            token=create_access_token(user.id, user.nickname),
        )

    async def activate_account(
        self,
        data: ActivationRequest,
    ) -> UserSession | dict[str, Any]:
        if not data.token:
            return {"errors": {"token": "Aktivačný token chýba."}}

        activation_token = await self.repository.get_activation_token(data.token)
        if activation_token is None:
            return {"errors": {"token": "Aktivačný token nie je platný."}}

        if activation_token.used_at is not None:
            return {"errors": {"token": "Aktivačný token už bol použitý."}}

        expires_at = activation_token.expires_at
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=UTC)
        if expires_at < datetime.now(UTC):
            return {"errors": {"token": "Aktivačný token expiroval."}}

        await self.repository.activate_user(activation_token.user_id)
        await self.repository.mark_activation_token_used(activation_token.token)
        await self.events.append(
            "UserActivated",
            {"userId": str(activation_token.user_id)},
        )

        return UserSession(
            nickname=activation_token.nickname,
            token=create_access_token(
                activation_token.user_id,
                activation_token.nickname,
            ),
        )

    async def update_password(
        self,
        user_id,
        current_password: str,
        password: str,
        password_confirmation: str,
    ) -> dict[str, str]:
        errors_by_field: dict[str, str] = {}
        if not current_password:
            errors_by_field["currentPassword"] = "Vyplň aktuálne heslo."
        if not password:
            errors_by_field["password"] = "Vyplň nové heslo."
        elif len(password) < 8:
            errors_by_field["password"] = "Heslo musí mať aspoň 8 znakov."
        if not password_confirmation:
            errors_by_field["passwordConfirmation"] = "Zopakuj nové heslo."
        elif password != password_confirmation:
            errors_by_field["passwordConfirmation"] = "Heslá sa nezhodujú."

        if errors_by_field:
            return errors_by_field

        user = await self.repository.get_user_by_id(user_id)
        if user is None or not verify_password(current_password, user.password_hash):
            return {"currentPassword": "Aktuálne heslo nie je správne."}

        await self.repository.update_password(user_id, hash_password(password))
        return {}

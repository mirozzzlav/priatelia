import re
import secrets
from datetime import UTC, datetime, timedelta
from typing import Any

from app.modules.auth.repository import AuthRepository
from app.modules.auth.schemas import (
    ActivationRequest,
    LoginRequest,
    PasswordResetConfirmRequest,
    PasswordResetRequest,
    PasswordResetRequestSuccess,
    PasswordResetTokenDetail,
    RegisterRequest,
    RegistrationSuccess,
    UserSession,
)
from app.modules.notifications.service import NotificationService
from app.shared.auth.passwords import hash_password, verify_password
from app.shared.auth.tokens import create_access_token
from app.shared.events.repository import EventRepository
from app.shared.geo import coordinates_are_valid, resolve_coordinates
from app.shared.nicknames import INVALID_NICKNAME_MESSAGE, is_valid_nickname
from app.shared.profile_photos import validate_profile_photos


def _word_count(value: str) -> int:
    return len(value.strip().split())


def _is_valid_email(value: str) -> bool:
    return bool(re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", value.strip()))


def validate_registration(data: RegisterRequest) -> dict[str, str]:
    errors_by_field: dict[str, str] = {}

    if not data.nickname.strip():
        errors_by_field["nickname"] = "Vyplň nickname."
    elif not is_valid_nickname(data.nickname):
        errors_by_field["nickname"] = INVALID_NICKNAME_MESSAGE
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
        errors_by_field["location"] = "Vyplň svoju lokalitu."
    elif not coordinates_are_valid(data.locationLatitude, data.locationLongitude):
        errors_by_field["location"] = "Poloha nemá platné súradnice."
    if _word_count(data.bio) == 0:
        errors_by_field["bio"] = "Vyplň krátke bio."
    elif _word_count(data.bio) < 3:
        errors_by_field["bio"] = "Bio musí obsahovať aspoň 3 slová."
    if not data.interests:
        errors_by_field["interests"] = "Pridaj aspoň jeden záujem."
    photo_error = validate_profile_photos(data.photos)
    if photo_error:
        errors_by_field["photos"] = photo_error

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
        coordinates = resolve_coordinates(
            data.location.strip(),
            data.locationLatitude,
            data.locationLongitude,
        )
        await self.repository.create_profile(
            user_id=user.id,
            birth_date=data.birthDate,
            gender=data.gender,
            location=data.location.strip(),
            latitude=coordinates.latitude if coordinates else None,
            longitude=coordinates.longitude if coordinates else None,
            bio=data.bio.strip(),
            looking_for=data.lookingFor.strip() or None,
            interest_ids=interest_ids,
            photos=data.photos,
        )
        await self.repository.create_default_discovery_settings(
            user_id=user.id,
            location=data.location.strip(),
            latitude=coordinates.latitude if coordinates else None,
            longitude=coordinates.longitude if coordinates else None,
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
        user = await self.repository.get_user_by_exact_nickname(data.nickname.strip())

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
            if activation_token.status == "active":
                return UserSession(
                    nickname=activation_token.nickname,
                    token=create_access_token(
                        activation_token.user_id,
                        activation_token.nickname,
                    ),
                )
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

    async def request_password_reset(
        self,
        data: PasswordResetRequest,
    ) -> PasswordResetRequestSuccess | dict[str, Any]:
        if not data.email.strip():
            return {"errors": {"email": "Vyplň email."}}
        if not _is_valid_email(data.email):
            return {"errors": {"email": "Email nemá správny formát."}}

        user = await self.repository.get_user_by_email(data.email.strip())
        if user is None or user.status != "active":
            return PasswordResetRequestSuccess()

        reset_token = secrets.token_urlsafe(32)
        await self.repository.mark_unused_password_reset_tokens_used_for_user(user.id)
        await self.repository.create_password_reset_token(
            user_id=user.id,
            token=reset_token,
            expires_at=datetime.now(UTC) + timedelta(hours=1),
        )
        await self.notifications.enqueue_password_reset_email(
            user_id=user.id,
            email=data.email.strip(),
            nickname=user.nickname,
            reset_token=reset_token,
        )
        await self.events.append(
            "PasswordResetRequested",
            {"userId": str(user.id)},
        )

        return PasswordResetRequestSuccess()

    async def get_password_reset_detail(
        self,
        token: str | None,
    ) -> PasswordResetTokenDetail | dict[str, Any]:
        if not token:
            return {"errors": {"token": "Link na obnovu hesla nie je platný."}}

        reset_token = await self.repository.get_password_reset_token(token)
        if reset_token is None:
            return {"errors": {"token": "Link na obnovu hesla nie je platný."}}
        if reset_token.used_at is not None:
            return {"errors": {"token": "Link na obnovu hesla už bol použitý."}}
        if reset_token.status != "active":
            return {"errors": {"token": "Účet nie je aktívny."}}

        expires_at = reset_token.expires_at
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=UTC)
        if expires_at < datetime.now(UTC):
            return {"errors": {"token": "Link na obnovu hesla expiroval."}}

        return PasswordResetTokenDetail(nickname=reset_token.nickname)

    async def reset_password(
        self,
        data: PasswordResetConfirmRequest,
    ) -> UserSession | dict[str, Any]:
        errors_by_field: dict[str, str] = {}
        if not data.token:
            errors_by_field["token"] = "Token na obnovu hesla chýba."
        if not data.password:
            errors_by_field["password"] = "Vyplň nové heslo."
        elif len(data.password) < 8:
            errors_by_field["password"] = "Heslo musí mať aspoň 8 znakov."
        if not data.passwordConfirmation:
            errors_by_field["passwordConfirmation"] = "Zopakuj nové heslo."
        elif data.password != data.passwordConfirmation:
            errors_by_field["passwordConfirmation"] = "Heslá sa nezhodujú."

        if errors_by_field:
            return {"errors": errors_by_field}

        reset_token = await self.repository.get_password_reset_token(data.token or "")
        if reset_token is None:
            return {"errors": {"token": "Link na obnovu hesla nie je platný."}}
        if reset_token.used_at is not None:
            return {"errors": {"token": "Link na obnovu hesla už bol použitý."}}
        if reset_token.status != "active":
            return {"errors": {"token": "Účet nie je aktívny."}}

        expires_at = reset_token.expires_at
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=UTC)
        if expires_at < datetime.now(UTC):
            return {"errors": {"token": "Link na obnovu hesla expiroval."}}

        await self.repository.update_password(
            reset_token.user_id,
            hash_password(data.password),
        )
        await self.repository.mark_password_reset_token_used(reset_token.token)
        await self.events.append(
            "PasswordResetCompleted",
            {"userId": str(reset_token.user_id)},
        )

        return UserSession(
            nickname=reset_token.nickname,
            token=create_access_token(reset_token.user_id, reset_token.nickname),
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

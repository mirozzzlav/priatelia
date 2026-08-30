from uuid import UUID

from psycopg import AsyncConnection

from app.modules.auth.schemas import (
    ActivationTokenRecord,
    RegistrationPhoto,
    UserRecord,
)


class AuthRepository:
    def __init__(self, connection: AsyncConnection):
        self.connection = connection

    async def get_user_by_nickname(self, nickname: str) -> UserRecord | None:
        cursor = await self.connection.execute(
            """
            SELECT id, nickname, password_hash, status
            FROM users
            WHERE lower(nickname) = lower(%s)
            """,
            (nickname,),
        )
        row = await cursor.fetchone()
        return UserRecord(**row) if row else None

    async def create_user(
        self,
        nickname: str,
        email: str,
        password_hash: str,
    ) -> UserRecord:
        cursor = await self.connection.execute(
            """
            INSERT INTO users (nickname, email, password_hash, status)
            VALUES (%s, %s, %s, 'pending')
            RETURNING id, nickname, password_hash, status
            """,
            (nickname, email, password_hash),
        )
        row = await cursor.fetchone()
        if row is None:
            raise RuntimeError("User was not created")
        return UserRecord(**row)

    async def get_user_by_email(self, email: str) -> UserRecord | None:
        cursor = await self.connection.execute(
            """
            SELECT id, nickname, password_hash, status
            FROM users
            WHERE lower(email) = lower(%s)
            """,
            (email,),
        )
        row = await cursor.fetchone()
        return UserRecord(**row) if row else None

    async def create_activation_token(
        self,
        user_id: UUID,
        token: str,
        expires_at,
    ) -> None:
        await self.connection.execute(
            """
            INSERT INTO activation_tokens (user_id, token, expires_at)
            VALUES (%s, %s, %s)
            """,
            (user_id, token, expires_at),
        )

    async def get_activation_token(
        self,
        token: str,
    ) -> ActivationTokenRecord | None:
        cursor = await self.connection.execute(
            """
            SELECT
                at.token,
                at.user_id,
                u.nickname,
                u.status,
                at.expires_at,
                at.used_at
            FROM activation_tokens at
            JOIN users u ON u.id = at.user_id
            WHERE at.token = %s
            """,
            (token,),
        )
        row = await cursor.fetchone()
        return ActivationTokenRecord(**row) if row else None

    async def mark_activation_token_used(self, token: str) -> None:
        await self.connection.execute(
            """
            UPDATE activation_tokens
            SET used_at = now()
            WHERE token = %s
            """,
            (token,),
        )

    async def activate_user(self, user_id: UUID) -> None:
        await self.connection.execute(
            """
            UPDATE users
            SET status = 'active', updated_at = now()
            WHERE id = %s
            """,
            (user_id,),
        )

    async def create_profile(
        self,
        user_id: UUID,
        birth_date: str,
        location: str,
        bio: str,
        photos: list[RegistrationPhoto],
    ) -> None:
        await self.connection.execute(
            """
            INSERT INTO profiles (user_id, birth_date, location, bio)
            VALUES (%s, %s, %s, %s)
            """,
            (user_id, birth_date, location, bio),
        )

        for position, photo in enumerate(photos):
            await self.connection.execute(
                """
                INSERT INTO profile_photos (id, user_id, name, url, is_primary, position)
                VALUES (%s, %s, %s, %s, %s, %s)
                """,
                (photo.id, user_id, photo.name, photo.url, photo.isPrimary, position),
            )

    async def create_default_discovery_settings(
        self,
        user_id: UUID,
        location: str,
    ) -> None:
        await self.connection.execute(
            """
            INSERT INTO discovery_settings (user_id, age_from, age_to, location)
            VALUES (%s, 18, 99, %s)
            """,
            (user_id, location),
        )

    async def update_password(self, user_id: UUID, password_hash: str) -> None:
        await self.connection.execute(
            """
            UPDATE users
            SET password_hash = %s, updated_at = now()
            WHERE id = %s
            """,
            (password_hash, user_id),
        )

    async def get_user_by_id(self, user_id: UUID) -> UserRecord | None:
        cursor = await self.connection.execute(
            """
            SELECT id, nickname, password_hash, status
            FROM users
            WHERE id = %s
            """,
            (user_id,),
        )
        row = await cursor.fetchone()
        return UserRecord(**row) if row else None

from uuid import UUID

from psycopg import AsyncConnection

from app.modules.profiles.schemas import ProfilePhoto, ProfileRecord


class ProfileRepository:
    def __init__(self, connection: AsyncConnection):
        self.connection = connection

    async def get_profile(self, user_id: UUID) -> ProfileRecord | None:
        cursor = await self.connection.execute(
            """
            SELECT
                p.user_id,
                u.nickname,
                p.birth_date,
                p.location,
                p.bio
            FROM profiles p
            JOIN users u ON u.id = p.user_id
            WHERE p.user_id = %s
            """,
            (user_id,),
        )
        row = await cursor.fetchone()
        return ProfileRecord(**row) if row else None

    async def is_nickname_used_by_another_user(
        self,
        user_id: UUID,
        nickname: str,
    ) -> bool:
        cursor = await self.connection.execute(
            """
            SELECT EXISTS (
                SELECT 1
                FROM users
                WHERE lower(nickname) = lower(%s)
                  AND id <> %s
            ) AS exists
            """,
            (nickname, user_id),
        )
        row = await cursor.fetchone()
        return bool(row["exists"])

    async def update_profile(
        self,
        user_id: UUID,
        nickname: str,
        birth_date: str,
        location: str,
        bio: str,
        photos: list[ProfilePhoto],
    ) -> None:
        await self.connection.execute(
            """
            UPDATE users
            SET nickname = %s, updated_at = now()
            WHERE id = %s
            """,
            (nickname, user_id),
        )
        await self.connection.execute(
            """
            INSERT INTO profiles (user_id, birth_date, location, bio)
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (user_id) DO UPDATE
            SET birth_date = EXCLUDED.birth_date,
                location = EXCLUDED.location,
                bio = EXCLUDED.bio,
                updated_at = now()
            """,
            (user_id, birth_date, location, bio),
        )
        await self.connection.execute(
            "DELETE FROM profile_photos WHERE user_id = %s",
            (user_id,),
        )
        for position, photo in enumerate(photos):
            await self.connection.execute(
                """
                INSERT INTO profile_photos (id, user_id, name, url, is_primary, position)
                VALUES (%s, %s, %s, %s, %s, %s)
                """,
                (photo.id, user_id, photo.name, photo.url, photo.isPrimary, position),
            )

    async def list_photos(self, user_id: UUID) -> list[ProfilePhoto]:
        cursor = await self.connection.execute(
            """
            SELECT id, name, url, is_primary AS "isPrimary"
            FROM profile_photos
            WHERE user_id = %s
            ORDER BY position, created_at
            """,
            (user_id,),
        )
        rows = await cursor.fetchall()
        return [ProfilePhoto(**row) for row in rows]

    async def get_public_profiles_by_ids(self, user_ids: list[UUID]) -> list[dict]:
        if not user_ids:
            return []

        cursor = await self.connection.execute(
            """
            SELECT
                p.user_id,
                u.nickname,
                date_part('year', age(p.birth_date))::int AS age,
                p.location,
                p.bio,
                COALESCE(primary_photo.url, '') AS photo
            FROM profiles p
            JOIN users u ON u.id = p.user_id
            LEFT JOIN LATERAL (
                SELECT url
                FROM profile_photos pp
                WHERE pp.user_id = p.user_id
                ORDER BY pp.is_primary DESC, pp.position
                LIMIT 1
            ) primary_photo ON true
            WHERE p.user_id = ANY(%s)
            """,
            (user_ids,),
        )
        return await cursor.fetchall()

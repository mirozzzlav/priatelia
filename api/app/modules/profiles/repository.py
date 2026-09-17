from uuid import UUID

from psycopg import AsyncConnection

from app.modules.profiles.schemas import InterestTag, ProfilePhoto, ProfileRecord
from app.shared.interest_tags import (
    list_known_interest_ids,
    resolve_interest_tags,
    search_interest_tags,
)


class ProfileRepository:
    def __init__(self, connection: AsyncConnection):
        self.connection = connection

    async def _profile_has_looking_for_column(self) -> bool:
        cursor = await self.connection.execute(
            """
            SELECT EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_schema = 'public'
                  AND table_name = 'profiles'
                  AND column_name = 'looking_for'
            ) AS exists
            """
        )
        row = await cursor.fetchone()
        return bool(row["exists"])

    async def get_profile(self, user_id: UUID) -> ProfileRecord | None:
        looking_for_select = (
            "p.looking_for"
            if await self._profile_has_looking_for_column()
            else "NULL AS looking_for"
        )
        cursor = await self.connection.execute(
            f"""
            SELECT
                p.user_id,
                u.nickname,
                u.email,
                p.birth_date,
                p.gender,
                p.location,
                p.latitude,
                p.longitude,
                p.bio,
                {looking_for_select}
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
        gender: str,
        location: str,
        latitude: float | None,
        longitude: float | None,
        bio: str,
        looking_for: str | None,
        interest_ids: list[str],
        photos: list[ProfilePhoto],
    ) -> None:
        has_looking_for_column = await self._profile_has_looking_for_column()
        await self.connection.execute(
            """
            UPDATE users
            SET nickname = %s, updated_at = now()
            WHERE id = %s
            """,
            (nickname, user_id),
        )
        if has_looking_for_column:
            await self.connection.execute(
                """
                INSERT INTO profiles
                    (
                        user_id,
                        birth_date,
                        gender,
                        location,
                        latitude,
                        longitude,
                        bio,
                        looking_for
                    )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (user_id) DO UPDATE
                SET birth_date = EXCLUDED.birth_date,
                    gender = EXCLUDED.gender,
                    location = EXCLUDED.location,
                    latitude = EXCLUDED.latitude,
                    longitude = EXCLUDED.longitude,
                    bio = EXCLUDED.bio,
                    looking_for = EXCLUDED.looking_for,
                    updated_at = now()
                """,
                (
                    user_id,
                    birth_date,
                    gender,
                    location,
                    latitude,
                    longitude,
                    bio,
                    looking_for,
                ),
            )
        else:
            await self.connection.execute(
                """
                INSERT INTO profiles
                    (user_id, birth_date, gender, location, latitude, longitude, bio)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (user_id) DO UPDATE
                SET birth_date = EXCLUDED.birth_date,
                    gender = EXCLUDED.gender,
                    location = EXCLUDED.location,
                    latitude = EXCLUDED.latitude,
                    longitude = EXCLUDED.longitude,
                    bio = EXCLUDED.bio,
                    updated_at = now()
                """,
                (user_id, birth_date, gender, location, latitude, longitude, bio),
            )
        await self.connection.execute(
            "DELETE FROM profile_interests WHERE user_id = %s",
            (user_id,),
        )
        for position, interest_id in enumerate(interest_ids):
            await self.connection.execute(
                """
                INSERT INTO profile_interests (user_id, interest_id, position)
                VALUES (%s, %s, %s)
                """,
                (user_id, interest_id, position),
            )

        await self.connection.execute(
            "DELETE FROM profile_photos WHERE user_id = %s",
            (user_id,),
        )
        for position, photo in enumerate(photos):
            await self.connection.execute(
                """
                INSERT INTO profile_photos
                    (id, user_id, name, url, is_primary, position)
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

    async def list_interests(self, user_id: UUID) -> list[InterestTag]:
        cursor = await self.connection.execute(
            """
            SELECT pi.interest_id
            FROM profile_interests pi
            WHERE pi.user_id = %s
            ORDER BY pi.position, pi.interest_id
            """,
            (user_id,),
        )
        rows = await cursor.fetchall()
        tags = resolve_interest_tags([row["interest_id"] for row in rows])
        return [InterestTag(**tag) for tag in tags]

    async def list_interest_options(self, query: str) -> list[InterestTag]:
        return [InterestTag(**tag) for tag in search_interest_tags(query)]

    async def list_known_interest_ids(self, interest_ids: list[str]) -> set[str]:
        return list_known_interest_ids(interest_ids)

    async def get_public_profiles_by_ids(self, user_ids: list[UUID]) -> list[dict]:
        if not user_ids:
            return []

        looking_for_select = (
            "p.looking_for"
            if await self._profile_has_looking_for_column()
            else "NULL AS looking_for"
        )
        cursor = await self.connection.execute(
            f"""
            SELECT
                p.user_id,
                u.nickname,
                date_part('year', age(p.birth_date))::int AS age,
                p.location,
                p.bio,
                {looking_for_select},
                COALESCE(primary_photo.url, '') AS photo,
                COALESCE(interest_list.interest_ids, ARRAY[]::text[]) AS interest_ids
            FROM profiles p
            JOIN users u ON u.id = p.user_id
            LEFT JOIN LATERAL (
                SELECT url
                FROM profile_photos pp
                WHERE pp.user_id = p.user_id
                ORDER BY pp.is_primary DESC, pp.position
                LIMIT 1
            ) primary_photo ON true
            LEFT JOIN LATERAL (
                SELECT array_agg(pi.interest_id ORDER BY pi.position, pi.interest_id)
                    AS interest_ids
                FROM profile_interests pi
                WHERE pi.user_id = p.user_id
            ) interest_list ON true
            WHERE p.user_id = ANY(%s)
            """,
            (user_ids,),
        )
        rows = await cursor.fetchall()
        return [
            {
                **row,
                "interests": resolve_interest_tags(row["interest_ids"]),
            }
            for row in rows
        ]

    async def get_public_profile_by_id(self, user_id: UUID) -> dict | None:
        looking_for_select = (
            "COALESCE(p.looking_for, '') AS \"lookingFor\""
            if await self._profile_has_looking_for_column()
            else "'' AS \"lookingFor\""
        )
        cursor = await self.connection.execute(
            f"""
            SELECT
                p.user_id::text AS id,
                date_part('year', age(p.birth_date))::int::text AS age,
                p.bio,
                {looking_for_select},
                ARRAY[p.location] AS meta,
                u.nickname AS name,
                COALESCE(primary_photo.url, '') AS photo,
                COALESCE(photo_list.photos, ARRAY[]::text[]) AS photos,
                COALESCE(interest_list.interest_ids, ARRAY[]::text[]) AS interest_ids
            FROM profiles p
            JOIN users u ON u.id = p.user_id
            LEFT JOIN LATERAL (
                SELECT url
                FROM profile_photos pp
                WHERE pp.user_id = p.user_id
                ORDER BY pp.is_primary DESC, pp.position
                LIMIT 1
            ) primary_photo ON true
            LEFT JOIN LATERAL (
                SELECT array_agg(url ORDER BY is_primary DESC, position) AS photos
                FROM profile_photos pp
                WHERE pp.user_id = p.user_id
            ) photo_list ON true
            LEFT JOIN LATERAL (
                SELECT array_agg(pi.interest_id ORDER BY pi.position, pi.interest_id)
                    AS interest_ids
                FROM profile_interests pi
                WHERE pi.user_id = p.user_id
            ) interest_list ON true
            WHERE p.user_id = %s
            """,
            (user_id,),
        )
        row = await cursor.fetchone()
        if row is None:
            return None
        return {**row, "tags": resolve_interest_tags(row["interest_ids"])}

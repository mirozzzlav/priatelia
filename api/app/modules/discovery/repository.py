from uuid import UUID

from psycopg import AsyncConnection

from app.modules.discovery.schemas import PersonPreview


class DiscoveryRepository:
    def __init__(self, connection: AsyncConnection):
        self.connection = connection

    async def upsert_settings(
        self,
        user_id: UUID,
        age_from: int,
        age_to: int,
        location: str,
    ) -> None:
        await self.connection.execute(
            """
            INSERT INTO discovery_settings (user_id, age_from, age_to, location)
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (user_id) DO UPDATE
            SET age_from = EXCLUDED.age_from,
                age_to = EXCLUDED.age_to,
                location = EXCLUDED.location,
                updated_at = now()
            """,
            (user_id, age_from, age_to, location),
        )

    async def get_next_profile(self, user_id: UUID) -> PersonPreview | None:
        cursor = await self.connection.execute(
            """
            WITH settings AS (
                SELECT age_from, age_to, location
                FROM discovery_settings
                WHERE user_id = %s
            )
            SELECT
                p.user_id::text AS id,
                date_part('year', age(p.birth_date))::int::text AS age,
                p.bio,
                ARRAY[p.location] AS meta,
                u.nickname AS name,
                COALESCE(primary_photo.url, '') AS photo,
                COALESCE(photo_list.photos, ARRAY[]::text[]) AS photos,
                COALESCE(interest_list.interests, ARRAY[]::json[]) AS tags
            FROM profiles p
            JOIN users u ON u.id = p.user_id
            CROSS JOIN settings s
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
                SELECT array_agg(
                    json_build_object('id', it.id, 'name', it.name)
                    ORDER BY pi.position, it.name
                ) AS interests
                FROM profile_interests pi
                JOIN interest_tags it ON it.id = pi.interest_id
                WHERE pi.user_id = p.user_id
            ) interest_list ON true
            WHERE p.user_id <> %s
              AND date_part('year', age(p.birth_date)) BETWEEN s.age_from AND s.age_to
              AND NOT EXISTS (
                  SELECT 1
                  FROM profile_decisions d
                  WHERE d.actor_user_id = %s
                    AND d.target_user_id = p.user_id
              )
            ORDER BY p.created_at DESC
            LIMIT 1
            """,
            (user_id, user_id, user_id),
        )
        row = await cursor.fetchone()
        return PersonPreview(**row) if row else None

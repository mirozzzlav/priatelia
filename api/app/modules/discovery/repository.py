from uuid import UUID

from psycopg import AsyncConnection

from app.modules.discovery.schemas import DiscoverySettingsResponse, PersonPreview


class DiscoveryRepository:
    def __init__(self, connection: AsyncConnection):
        self.connection = connection

    async def get_settings(self, user_id: UUID) -> DiscoverySettingsResponse | None:
        cursor = await self.connection.execute(
            """
            SELECT
                age_from::text AS "ageFrom",
                age_to::text AS "ageTo",
                location,
                latitude AS "locationLatitude",
                longitude AS "locationLongitude",
                radius_km::text AS "radiusKm"
            FROM discovery_settings
            WHERE user_id = %s
            """,
            (user_id,),
        )
        row = await cursor.fetchone()
        return DiscoverySettingsResponse(**row) if row else None

    async def upsert_settings(
        self,
        user_id: UUID,
        age_from: int,
        age_to: int,
        location: str,
        latitude: float | None,
        longitude: float | None,
        radius_km: int,
    ) -> None:
        await self.connection.execute(
            """
            INSERT INTO discovery_settings
                (
                    user_id,
                    age_from,
                    age_to,
                    location,
                    latitude,
                    longitude,
                    radius_km
                )
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (user_id) DO UPDATE
            SET age_from = EXCLUDED.age_from,
                age_to = EXCLUDED.age_to,
                location = EXCLUDED.location,
                latitude = EXCLUDED.latitude,
                longitude = EXCLUDED.longitude,
                radius_km = EXCLUDED.radius_km,
                updated_at = now()
            """,
            (user_id, age_from, age_to, location, latitude, longitude, radius_km),
        )

    async def get_next_profile(self, user_id: UUID) -> PersonPreview | None:
        cursor = await self.connection.execute(
            """
            WITH settings AS (
                SELECT age_from, age_to, location, latitude, longitude, radius_km
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
              AND (
                  (
                      s.latitude IS NOT NULL
                      AND s.longitude IS NOT NULL
                      AND p.latitude IS NOT NULL
                      AND p.longitude IS NOT NULL
                      AND 6371 * 2 * asin(
                          sqrt(
                              power(
                                  sin(radians((p.latitude - s.latitude) / 2)),
                                  2
                              )
                              + cos(radians(s.latitude))
                              * cos(radians(p.latitude))
                              * power(
                                  sin(
                                      radians((p.longitude - s.longitude) / 2)
                                  ),
                                  2
                              )
                          )
                      ) <= s.radius_km
                  )
                  OR (
                      (s.latitude IS NULL OR p.latitude IS NULL)
                      AND (
                          lower(p.location) = lower(s.location)
                          OR position(lower(s.location) in lower(p.location)) > 0
                          OR position(lower(p.location) in lower(s.location)) > 0
                      )
                  )
              )
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

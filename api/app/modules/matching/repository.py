from uuid import UUID

from psycopg import AsyncConnection

from app.modules.matching.schemas import MatchRecord


class MatchingRepository:
    def __init__(self, connection: AsyncConnection):
        self.connection = connection

    async def save_decision(
        self,
        actor_user_id: UUID,
        target_user_id: UUID,
        action: str,
    ) -> None:
        await self.connection.execute(
            """
            INSERT INTO profile_decisions (actor_user_id, target_user_id, action)
            VALUES (%s, %s, %s)
            ON CONFLICT (actor_user_id, target_user_id) DO UPDATE
            SET action = EXCLUDED.action,
                created_at = now()
            """,
            (actor_user_id, target_user_id, action),
        )

    async def has_reverse_like(self, actor_user_id: UUID, target_user_id: UUID) -> bool:
        cursor = await self.connection.execute(
            """
            SELECT EXISTS (
                SELECT 1
                FROM profile_decisions
                WHERE actor_user_id = %s
                  AND target_user_id = %s
                  AND action = 'like'
            ) AS exists
            """,
            (target_user_id, actor_user_id),
        )
        row = await cursor.fetchone()
        return bool(row["exists"])

    async def create_match(self, first_user_id: UUID, second_user_id: UUID) -> UUID:
        left_user_id, right_user_id = sorted([first_user_id, second_user_id])
        cursor = await self.connection.execute(
            """
            INSERT INTO matches (first_user_id, second_user_id)
            VALUES (%s, %s)
            ON CONFLICT (first_user_id, second_user_id) DO UPDATE
            SET first_user_id = EXCLUDED.first_user_id
            RETURNING id
            """,
            (left_user_id, right_user_id),
        )
        row = await cursor.fetchone()
        if row is None:
            raise RuntimeError("Match was not created")
        return row["id"]

    async def list_matches(self, user_id: UUID) -> list[MatchRecord]:
        cursor = await self.connection.execute(
            """
            SELECT
                id,
                CASE
                    WHEN first_user_id = %s THEN second_user_id
                    ELSE first_user_id
                END AS other_user_id,
                created_at
            FROM matches
            WHERE first_user_id = %s OR second_user_id = %s
            ORDER BY created_at DESC
            """,
            (user_id, user_id, user_id),
        )
        rows = await cursor.fetchall()
        return [MatchRecord(**row) for row in rows]

    async def user_can_access_match(self, user_id: UUID, match_id: UUID) -> bool:
        cursor = await self.connection.execute(
            """
            SELECT EXISTS (
                SELECT 1
                FROM matches
                WHERE id = %s
                  AND (first_user_id = %s OR second_user_id = %s)
            ) AS exists
            """,
            (match_id, user_id, user_id),
        )
        row = await cursor.fetchone()
        return bool(row["exists"])

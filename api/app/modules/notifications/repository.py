from dataclasses import dataclass
from typing import Any
from uuid import UUID

from psycopg import AsyncConnection
from psycopg.types.json import Json


@dataclass(frozen=True)
class NotificationJobRecord:
    id: UUID
    type: str
    recipient_user_id: UUID | None
    payload: dict[str, Any]
    attempts: int


class NotificationRepository:
    def __init__(self, connection: AsyncConnection):
        self.connection = connection

    async def enqueue(
        self,
        notification_type: str,
        recipient_user_id: UUID | None,
        payload: dict[str, Any],
    ) -> None:
        await self.connection.execute(
            """
            INSERT INTO notification_jobs (type, recipient_user_id, payload)
            VALUES (%s, %s, %s)
            """,
            (notification_type, recipient_user_id, Json(payload)),
        )

    async def claim_pending(
        self,
        limit: int,
        max_attempts: int,
        processing_timeout_seconds: int,
    ) -> list[NotificationJobRecord]:
        cursor = await self.connection.execute(
            """
            WITH next_jobs AS (
                SELECT id
                FROM notification_jobs
                WHERE attempts < %s
                  AND (
                    status = 'pending'
                    OR (
                        status = 'processing'
                        AND updated_at < now() - (%s * interval '1 second')
                    )
                  )
                ORDER BY created_at
                FOR UPDATE SKIP LOCKED
                LIMIT %s
            )
            UPDATE notification_jobs nj
            SET status = 'processing',
                attempts = nj.attempts + 1,
                updated_at = now()
            FROM next_jobs
            WHERE nj.id = next_jobs.id
            RETURNING
                nj.id,
                nj.type,
                nj.recipient_user_id,
                nj.payload,
                nj.attempts
            """,
            (max_attempts, processing_timeout_seconds, limit),
        )
        rows = await cursor.fetchall()
        return [NotificationJobRecord(**row) for row in rows]

    async def mark_sent(self, job_id: UUID) -> None:
        await self.connection.execute(
            """
            UPDATE notification_jobs
            SET status = 'sent',
                sent_at = now(),
                updated_at = now()
            WHERE id = %s
            """,
            (job_id,),
        )

    async def mark_failed(self, job_id: UUID, should_retry: bool) -> None:
        status = "pending" if should_retry else "failed"
        await self.connection.execute(
            """
            UPDATE notification_jobs
            SET status = %s,
                updated_at = now()
            WHERE id = %s
            """,
            (status, job_id),
        )

from typing import Any
from uuid import UUID

from psycopg import AsyncConnection
from psycopg.types.json import Json


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

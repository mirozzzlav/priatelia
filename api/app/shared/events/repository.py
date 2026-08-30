from typing import Any

from psycopg import AsyncConnection
from psycopg.types.json import Json


class EventRepository:
    def __init__(self, connection: AsyncConnection):
        self.connection = connection

    async def append(self, event_type: str, payload: dict[str, Any]) -> None:
        await self.connection.execute(
            """
            INSERT INTO outbox_events (type, payload)
            VALUES (%s, %s)
            """,
            (event_type, Json(payload)),
        )

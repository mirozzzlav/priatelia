from uuid import UUID

from psycopg import AsyncConnection

from app.modules.chats.schemas import ChatMessageRecord, ChatThreadReceiptRecord


class ChatRepository:
    def __init__(self, connection: AsyncConnection):
        self.connection = connection

    async def ensure_thread(self, match_id: UUID) -> UUID:
        cursor = await self.connection.execute(
            """
            INSERT INTO chat_threads (match_id)
            VALUES (%s)
            ON CONFLICT (match_id) DO UPDATE
            SET match_id = EXCLUDED.match_id
            RETURNING id
            """,
            (match_id,),
        )
        row = await cursor.fetchone()
        if row is None:
            raise RuntimeError("Chat thread was not created")
        return row["id"]

    async def insert_message(
        self,
        match_id: UUID,
        sender_user_id: UUID,
        text: str,
    ) -> ChatMessageRecord:
        thread_id = await self.ensure_thread(match_id)
        cursor = await self.connection.execute(
            """
            INSERT INTO chat_messages (thread_id, sender_user_id, text)
            VALUES (%s, %s, %s)
            RETURNING
                id,
                %s::uuid AS match_id,
                sender_user_id,
                text,
                sent_at
            """,
            (thread_id, sender_user_id, text, match_id),
        )
        row = await cursor.fetchone()
        if row is None:
            raise RuntimeError("Chat message was not created")
        return ChatMessageRecord(**row)

    async def list_messages(self, match_id: UUID) -> list[ChatMessageRecord]:
        cursor = await self.connection.execute(
            """
            SELECT
                cm.id,
                ct.match_id,
                cm.sender_user_id,
                cm.text,
                cm.sent_at
            FROM chat_threads ct
            JOIN chat_messages cm ON cm.thread_id = ct.id
            WHERE ct.match_id = %s
            ORDER BY cm.sent_at ASC
            """,
            (match_id,),
        )
        rows = await cursor.fetchall()
        return [ChatMessageRecord(**row) for row in rows]

    async def mark_thread_read(
        self,
        match_id: UUID,
        user_id: UUID,
    ) -> ChatThreadReceiptRecord:
        cursor = await self.connection.execute(
            """
            INSERT INTO chat_thread_receipts (
                thread_id,
                user_id,
                delivered_at,
                last_read_at
            )
            SELECT id, %s, now(), now()
            FROM chat_threads
            WHERE match_id = %s
            ON CONFLICT (thread_id, user_id) DO UPDATE
            SET delivered_at = GREATEST(
                    COALESCE(
                        chat_thread_receipts.delivered_at,
                        '-infinity'::timestamptz
                    ),
                    EXCLUDED.delivered_at
                ),
                last_read_at = GREATEST(
                    COALESCE(
                        chat_thread_receipts.last_read_at,
                        '-infinity'::timestamptz
                    ),
                    EXCLUDED.last_read_at
                )
            RETURNING delivered_at, last_read_at
            """,
            (user_id, match_id),
        )
        row = await cursor.fetchone()
        if row is None:
            raise RuntimeError("Chat thread receipt was not updated")
        return ChatThreadReceiptRecord(**row)

    async def mark_thread_delivered(
        self,
        match_id: UUID,
        user_id: UUID,
    ) -> ChatThreadReceiptRecord:
        cursor = await self.connection.execute(
            """
            INSERT INTO chat_thread_receipts (thread_id, user_id, delivered_at)
            SELECT id, %s, now()
            FROM chat_threads
            WHERE match_id = %s
            ON CONFLICT (thread_id, user_id) DO UPDATE
            SET delivered_at = GREATEST(
                COALESCE(
                    chat_thread_receipts.delivered_at,
                    '-infinity'::timestamptz
                ),
                EXCLUDED.delivered_at
            )
            RETURNING delivered_at, last_read_at
            """,
            (user_id, match_id),
        )
        row = await cursor.fetchone()
        if row is None:
            raise RuntimeError("Chat thread receipt was not updated")
        return ChatThreadReceiptRecord(**row)

    async def get_thread_receipt(
        self,
        match_id: UUID,
        user_id: UUID,
    ) -> ChatThreadReceiptRecord | None:
        cursor = await self.connection.execute(
            """
            SELECT ctr.delivered_at, ctr.last_read_at
            FROM chat_thread_receipts ctr
            JOIN chat_threads ct ON ct.id = ctr.thread_id
            WHERE ct.match_id = %s
              AND ctr.user_id = %s
            """,
            (match_id, user_id),
        )
        row = await cursor.fetchone()
        return ChatThreadReceiptRecord(**row) if row else None

    async def mark_matches_seen(self, match_ids: list[UUID], user_id: UUID) -> None:
        if not match_ids:
            return

        await self.connection.execute(
            """
            INSERT INTO match_views (match_id, user_id, seen_at)
            SELECT id, %s, now()
            FROM matches
            WHERE id = ANY(%s)
              AND (first_user_id = %s OR second_user_id = %s)
            ON CONFLICT (match_id, user_id) DO NOTHING
            """,
            (user_id, match_ids, user_id, user_id),
        )

    async def get_seen_match_ids(
        self,
        user_id: UUID,
        match_ids: list[UUID],
    ) -> set[UUID]:
        if not match_ids:
            return set()

        cursor = await self.connection.execute(
            """
            SELECT match_id
            FROM match_views
            WHERE user_id = %s
              AND match_id = ANY(%s)
            """,
            (user_id, match_ids),
        )
        rows = await cursor.fetchall()
        return {row["match_id"] for row in rows}

    async def get_last_messages_by_match_ids(
        self,
        match_ids: list[UUID],
    ) -> dict[UUID, ChatMessageRecord]:
        if not match_ids:
            return {}

        cursor = await self.connection.execute(
            """
            SELECT DISTINCT ON (ct.match_id)
                cm.id,
                ct.match_id,
                cm.sender_user_id,
                cm.text,
                cm.sent_at
            FROM chat_threads ct
            JOIN chat_messages cm ON cm.thread_id = ct.id
            WHERE ct.match_id = ANY(%s)
            ORDER BY ct.match_id, cm.sent_at DESC
            """,
            (match_ids,),
        )
        rows = await cursor.fetchall()
        records = [ChatMessageRecord(**row) for row in rows]
        return {record.match_id: record for record in records}

    async def get_unread_counts_by_match_ids(
        self,
        user_id: UUID,
        match_ids: list[UUID],
    ) -> dict[UUID, int]:
        if not match_ids:
            return {}

        cursor = await self.connection.execute(
            """
            SELECT
                ct.match_id,
                count(cm.id)::int AS unread_count
            FROM chat_threads ct
            JOIN chat_messages cm ON cm.thread_id = ct.id
            LEFT JOIN chat_thread_receipts ctr
                ON ctr.thread_id = ct.id
               AND ctr.user_id = %s
            WHERE ct.match_id = ANY(%s)
              AND cm.sender_user_id <> %s
              AND (ctr.last_read_at IS NULL OR cm.sent_at > ctr.last_read_at)
            GROUP BY ct.match_id
            """,
            (user_id, match_ids, user_id),
        )
        rows = await cursor.fetchall()
        return {row["match_id"]: row["unread_count"] for row in rows}

from uuid import UUID

from psycopg import AsyncConnection


class FeedbackRepository:
    def __init__(self, connection: AsyncConnection):
        self.connection = connection

    async def create_feedback(
        self,
        user_id: UUID,
        overall_rating: int,
        principle_clear: bool,
        unclear_reason: str | None,
        improvement_suggestion: str | None,
    ) -> None:
        await self.connection.execute(
            """
            INSERT INTO user_feedback (
                user_id,
                overall_rating,
                principle_clear,
                unclear_reason,
                improvement_suggestion
            )
            VALUES (%s, %s, %s, %s, %s)
            """,
            (
                user_id,
                overall_rating,
                principle_clear,
                unclear_reason,
                improvement_suggestion,
            ),
        )

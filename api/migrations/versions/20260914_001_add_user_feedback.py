from alembic import op

revision = "20260914_001"
down_revision = "20260913_003"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE user_feedback (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            overall_rating INTEGER NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
            principle_clear BOOLEAN NOT NULL,
            unclear_reason TEXT,
            improvement_suggestion TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
            CHECK (
                principle_clear
                OR (
                    unclear_reason IS NOT NULL
                    AND char_length(btrim(unclear_reason)) > 0
                )
            )
        );

        CREATE INDEX idx_user_feedback_user_created
            ON user_feedback(user_id, created_at DESC);
        """
    )


def downgrade() -> None:
    op.execute(
        """
        DROP TABLE IF EXISTS user_feedback;
        """
    )

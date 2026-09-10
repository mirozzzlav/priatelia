from alembic import op

revision = "20260907_001"
down_revision = "20260906_002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS chat_thread_receipts (
            thread_id UUID NOT NULL REFERENCES chat_threads(id) ON DELETE CASCADE,
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            delivered_at TIMESTAMPTZ,
            last_read_at TIMESTAMPTZ,
            PRIMARY KEY (thread_id, user_id)
        );

        DO $$
        BEGIN
            IF to_regclass('public.message_reads') IS NOT NULL THEN
                INSERT INTO chat_thread_receipts (thread_id, user_id, last_read_at)
                SELECT thread_id, user_id, last_read_at
                FROM message_reads
                ON CONFLICT (thread_id, user_id) DO UPDATE
                SET last_read_at = EXCLUDED.last_read_at;

                DROP TABLE message_reads;
            END IF;
        END $$;
        """
    )


def downgrade() -> None:
    op.execute(
        """
        CREATE TABLE message_reads (
            thread_id UUID NOT NULL REFERENCES chat_threads(id) ON DELETE CASCADE,
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            last_read_at TIMESTAMPTZ NOT NULL DEFAULT now(),
            PRIMARY KEY (thread_id, user_id)
        );

        INSERT INTO message_reads (thread_id, user_id, last_read_at)
        SELECT thread_id, user_id, COALESCE(last_read_at, delivered_at, now())
        FROM chat_thread_receipts
        ON CONFLICT (thread_id, user_id) DO UPDATE
        SET last_read_at = EXCLUDED.last_read_at;

        DROP TABLE chat_thread_receipts;
        """
    )

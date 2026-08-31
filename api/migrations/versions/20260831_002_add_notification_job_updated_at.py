from alembic import op

revision = "20260831_002"
down_revision = "20260831_001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        ALTER TABLE notification_jobs
        ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

        CREATE INDEX idx_notification_jobs_pending
            ON notification_jobs(status, created_at)
            WHERE status IN ('pending', 'processing');
        """
    )


def downgrade() -> None:
    op.execute(
        """
        DROP INDEX IF EXISTS idx_notification_jobs_pending;
        ALTER TABLE notification_jobs DROP COLUMN IF EXISTS updated_at;
        """
    )

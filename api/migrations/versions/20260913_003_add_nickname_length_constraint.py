from alembic import op

revision = "20260913_003"
down_revision = "20260913_002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        ALTER TABLE users
        ADD CONSTRAINT users_nickname_max_length
        CHECK (char_length(nickname) <= 15);
        """
    )


def downgrade() -> None:
    op.execute(
        """
        ALTER TABLE users
        DROP CONSTRAINT IF EXISTS users_nickname_max_length;
        """
    )

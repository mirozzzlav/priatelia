from alembic import op

revision = "20260902_001"
down_revision = "20260901_001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        CREATE UNIQUE INDEX uq_users_nickname_lower
        ON users (lower(nickname));
        """
    )


def downgrade() -> None:
    op.execute("DROP INDEX IF EXISTS uq_users_nickname_lower;")

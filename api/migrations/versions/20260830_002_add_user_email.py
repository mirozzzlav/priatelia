from alembic import op

revision = "20260830_002"
down_revision = "20260830_001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("ALTER TABLE users ADD COLUMN email TEXT;")
    op.execute(
        """
        UPDATE users
        SET email = lower(nickname) || '@priatelia.local'
        WHERE email IS NULL;
        """
    )
    op.execute("ALTER TABLE users ALTER COLUMN email SET NOT NULL;")
    op.execute("CREATE UNIQUE INDEX uq_users_email_lower ON users (lower(email));")


def downgrade() -> None:
    op.execute("DROP INDEX IF EXISTS uq_users_email_lower;")
    op.execute("ALTER TABLE users DROP COLUMN IF EXISTS email;")

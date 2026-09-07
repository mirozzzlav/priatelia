from alembic import op

revision = "20260907_002"
down_revision = "20260907_001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        ALTER TABLE profiles
        ADD COLUMN looking_for TEXT;
        """
    )


def downgrade() -> None:
    op.execute(
        """
        ALTER TABLE profiles
        DROP COLUMN IF EXISTS looking_for;
        """
    )

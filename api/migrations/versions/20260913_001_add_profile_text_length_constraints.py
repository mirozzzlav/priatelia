from alembic import op

revision = "20260913_001"
down_revision = "20260911_001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        ALTER TABLE profiles
        ADD CONSTRAINT profiles_bio_max_length
        CHECK (char_length(bio) <= 500);

        ALTER TABLE profiles
        ADD CONSTRAINT profiles_looking_for_max_length
        CHECK (looking_for IS NULL OR char_length(looking_for) <= 300);
        """
    )


def downgrade() -> None:
    op.execute(
        """
        ALTER TABLE profiles
        DROP CONSTRAINT IF EXISTS profiles_looking_for_max_length;

        ALTER TABLE profiles
        DROP CONSTRAINT IF EXISTS profiles_bio_max_length;
        """
    )

from alembic import op

revision = "20260906_001"
down_revision = "20260904_001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        ALTER TABLE profiles
        ADD COLUMN gender TEXT NOT NULL DEFAULT 'unspecified',
        ADD CONSTRAINT chk_profiles_gender
            CHECK (gender IN ('male', 'female', 'unspecified'));

        ALTER TABLE discovery_settings
        ADD COLUMN gender_preferences TEXT[] NOT NULL
            DEFAULT ARRAY['male', 'female', 'unspecified']::text[],
        ADD CONSTRAINT chk_discovery_settings_gender_preferences
            CHECK (
                cardinality(gender_preferences) > 0
                AND gender_preferences <@ ARRAY['male', 'female', 'unspecified']::text[]
            );
        """
    )


def downgrade() -> None:
    op.execute(
        """
        ALTER TABLE discovery_settings
        DROP CONSTRAINT IF EXISTS chk_discovery_settings_gender_preferences,
        DROP COLUMN IF EXISTS gender_preferences;

        ALTER TABLE profiles
        DROP CONSTRAINT IF EXISTS chk_profiles_gender,
        DROP COLUMN IF EXISTS gender;
        """
    )

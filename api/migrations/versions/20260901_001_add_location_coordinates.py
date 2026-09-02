from alembic import op

revision = "20260901_001"
down_revision = "20260831_002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        ALTER TABLE profiles
        ADD COLUMN latitude DOUBLE PRECISION,
        ADD COLUMN longitude DOUBLE PRECISION;

        ALTER TABLE discovery_settings
        ADD COLUMN latitude DOUBLE PRECISION,
        ADD COLUMN longitude DOUBLE PRECISION,
        ADD COLUMN radius_km INTEGER NOT NULL DEFAULT 50;

        UPDATE profiles
        SET
            latitude = CASE
                WHEN lower(location) LIKE '%bratislava%' THEN 48.1486
                WHEN lower(location) LIKE '%brno%' THEN 49.1951
                WHEN lower(location) LIKE '%levice%' THEN 48.2156
                WHEN lower(location) LIKE '%nitra%' THEN 48.3061
                WHEN lower(location) LIKE '%trnava%' THEN 48.3774
                ELSE latitude
            END,
            longitude = CASE
                WHEN lower(location) LIKE '%bratislava%' THEN 17.1077
                WHEN lower(location) LIKE '%brno%' THEN 16.6068
                WHEN lower(location) LIKE '%levice%' THEN 18.6071
                WHEN lower(location) LIKE '%nitra%' THEN 18.0764
                WHEN lower(location) LIKE '%trnava%' THEN 17.5872
                ELSE longitude
            END;

        UPDATE discovery_settings
        SET
            latitude = CASE
                WHEN lower(location) LIKE '%bratislava%' THEN 48.1486
                WHEN lower(location) LIKE '%brno%' THEN 49.1951
                WHEN lower(location) LIKE '%levice%' THEN 48.2156
                WHEN lower(location) LIKE '%nitra%' THEN 48.3061
                WHEN lower(location) LIKE '%trnava%' THEN 48.3774
                ELSE latitude
            END,
            longitude = CASE
                WHEN lower(location) LIKE '%bratislava%' THEN 17.1077
                WHEN lower(location) LIKE '%brno%' THEN 16.6068
                WHEN lower(location) LIKE '%levice%' THEN 18.6071
                WHEN lower(location) LIKE '%nitra%' THEN 18.0764
                WHEN lower(location) LIKE '%trnava%' THEN 17.5872
                ELSE longitude
            END;

        CREATE INDEX idx_profiles_coordinates
            ON profiles(latitude, longitude)
            WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
        """
    )


def downgrade() -> None:
    op.execute(
        """
        DROP INDEX IF EXISTS idx_profiles_coordinates;

        ALTER TABLE discovery_settings
        DROP COLUMN IF EXISTS radius_km,
        DROP COLUMN IF EXISTS longitude,
        DROP COLUMN IF EXISTS latitude;

        ALTER TABLE profiles
        DROP COLUMN IF EXISTS longitude,
        DROP COLUMN IF EXISTS latitude;
        """
    )

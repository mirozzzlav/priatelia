from alembic import op

revision = "20260917_001"
down_revision = "20260914_001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        ALTER TABLE profile_interests
        DROP CONSTRAINT IF EXISTS profile_interests_interest_id_fkey;

        DROP TABLE IF EXISTS interest_tags;
        """
    )


def downgrade() -> None:
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS interest_tags (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );

        INSERT INTO interest_tags (id, name)
        SELECT DISTINCT interest_id, interest_id
        FROM profile_interests
        ON CONFLICT (id) DO NOTHING;

        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1
                FROM pg_constraint
                WHERE conname = 'profile_interests_interest_id_fkey'
            ) THEN
                ALTER TABLE profile_interests
                ADD CONSTRAINT profile_interests_interest_id_fkey
                FOREIGN KEY (interest_id)
                REFERENCES interest_tags(id)
                ON DELETE RESTRICT;
            END IF;
        END $$;
        """
    )

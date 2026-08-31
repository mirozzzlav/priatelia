from alembic import op

revision = "20260831_001"
down_revision = "20260830_002"
branch_labels = None
depends_on = None

interest_tags = [
    ("beh", "Beh"),
    ("bicykel", "Bicykel"),
    ("bistra", "Bistrá"),
    ("cestovanie", "Cestovanie"),
    ("caj", "Čaj"),
    ("dizajn", "Dizajn"),
    ("doskovky", "Doskovky"),
    ("fitko", "Fitko"),
    ("fotografia", "Fotografia"),
    ("gitara", "Gitara"),
    ("jedlo", "Jedlo"),
    ("kava", "Káva"),
    ("kino", "Kino"),
    ("knihy", "Knihy"),
    ("koncerty", "Koncerty"),
    ("lezenie", "Lezenie"),
    ("plavanie", "Plávanie"),
    ("podcasty", "Podcasty"),
    ("turistika", "Turistika"),
    ("varenie", "Varenie"),
    ("wellness", "Wellness"),
    ("vystavy", "Výstavy"),
    ("vylety", "Výlety"),
]


def upgrade() -> None:
    values_sql = ", ".join(
        f"('{interest_id}', '{name}')" for interest_id, name in interest_tags
    )

    op.execute(
        f"""
        CREATE TABLE interest_tags (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );

        INSERT INTO interest_tags (id, name)
        VALUES {values_sql};

        CREATE TABLE profile_interests (
            user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
            interest_id TEXT NOT NULL REFERENCES interest_tags(id) ON DELETE RESTRICT,
            position INTEGER NOT NULL DEFAULT 0,
            created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
            PRIMARY KEY (user_id, interest_id)
        );

        CREATE INDEX idx_profile_interests_user_position
            ON profile_interests(user_id, position);
        """
    )


def downgrade() -> None:
    op.execute(
        """
        DROP INDEX IF EXISTS idx_profile_interests_user_position;
        DROP TABLE IF EXISTS profile_interests;
        DROP TABLE IF EXISTS interest_tags;
        """
    )

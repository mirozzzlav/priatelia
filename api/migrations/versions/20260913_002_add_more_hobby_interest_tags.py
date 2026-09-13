from alembic import op

revision = "20260913_002"
down_revision = "20260913_001"
branch_labels = None
depends_on = None


interest_tags = [
    ("atletika", "Atletika"),
    ("badminton", "Badminton"),
    ("basketbal", "Basketbal"),
    ("bezky", "Bežky"),
    ("biliard", "Biliard"),
    ("bouldering", "Bouldering"),
    ("bojove-umenia", "Bojové umenia"),
    ("box", "Box"),
    ("crossfit", "CrossFit"),
    ("frisbee", "Frisbee"),
    ("golf", "Golf"),
    ("hadzana", "Hádzaná"),
    ("hokej", "Hokej"),
    ("hudba", "Hudba"),
    ("joga", "Joga"),
    ("judo", "Judo"),
    ("kajak", "Kajak"),
    ("kalistenika", "Kalistenika"),
    ("karate", "Karate"),
    ("kickbox", "Kickbox"),
    ("kreslenie", "Kreslenie"),
    ("kvizy", "Kvízy"),
    ("malovanie", "Maľovanie"),
    ("mma", "MMA"),
    ("muay-thai", "Muay Thai"),
    ("padel", "Padel"),
    ("paddleboard", "Paddleboard"),
    ("parkour", "Parkour"),
    ("pilates", "Pilates"),
    ("posilnovanie", "Posilňovanie"),
    ("powerlifting", "Powerlifting"),
    ("rugby", "Rugby"),
    ("skialp", "Skialp"),
    ("snowboard", "Snowboard"),
    ("spev", "Spev"),
    ("squash", "Squash"),
    ("stolny-tenis", "Stolný tenis"),
    ("surfovanie", "Surfovanie"),
    ("taekwondo", "Taekwondo"),
    ("triatlon", "Triatlon"),
    ("veslovanie", "Veslovanie"),
    ("vodne-polo", "Vodné pólo"),
    ("volejbal", "Volejbal"),
    ("vzpieranie", "Vzpieranie"),
    ("zapasenie", "Zápasenie"),
]


def upgrade() -> None:
    values_sql = ", ".join(
        f"('{interest_id}', '{name}')" for interest_id, name in interest_tags
    )

    op.execute(
        f"""
        INSERT INTO interest_tags (id, name)
        VALUES {values_sql}
        ON CONFLICT (id) DO UPDATE
        SET name = EXCLUDED.name;
        """
    )


def downgrade() -> None:
    ids_sql = ", ".join(f"'{interest_id}'" for interest_id, _ in interest_tags)

    op.execute(
        f"""
        DELETE FROM interest_tags
        WHERE id IN ({ids_sql})
          AND NOT EXISTS (
              SELECT 1
              FROM profile_interests
              WHERE profile_interests.interest_id = interest_tags.id
          );
        """
    )

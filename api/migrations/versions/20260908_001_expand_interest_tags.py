from alembic import op

revision = "20260908_001"
down_revision = "20260907_002"
branch_labels = None
depends_on = None


interest_tags = [
    ("architektura", "Architektúra"),
    ("behanie-v-prirode", "Behanie v prírode"),
    ("blogovanie", "Blogovanie"),
    ("bowling", "Bowling"),
    ("camping", "Camping"),
    ("cudzie-jazyky", "Cudzie jazyky"),
    ("divadlo", "Divadlo"),
    ("dobrovolnictvo", "Dobrovoľníctvo"),
    ("domace-zvierata", "Domáce zvieratá"),
    ("financie", "Financie"),
    ("florbal", "Florbal"),
    ("futbal", "Futbal"),
    ("hry", "Hry"),
    ("korculovanie", "Korčuľovanie"),
    ("kreativne-pisanie", "Kreatívne písanie"),
    ("lyzovanie", "Lyžovanie"),
    ("meditacia", "Meditácia"),
    ("motorky", "Motorky"),
    ("muzea", "Múzeá"),
    ("nakupovanie", "Nakupovanie"),
    ("nocne-prechadzky", "Nočné prechádzky"),
    ("pecenie", "Pečenie"),
    ("pikniky", "Pikniky"),
    ("politika", "Politika"),
    ("programovanie", "Programovanie"),
    ("psychologia", "Psychológia"),
    ("rucne-prace", "Ručné práce"),
    ("sauna", "Sauna"),
    ("skateboarding", "Skateboarding"),
    ("spolocenske-hry", "Spoločenské hry"),
    ("standup", "Stand-up"),
    ("tanec", "Tanec"),
    ("technologie", "Technológie"),
    ("tenis", "Tenis"),
    ("turisticke-chaty", "Turistické chaty"),
    ("umenie", "Umenie"),
    ("vino", "Víno"),
    ("vzdelavanie", "Vzdelávanie"),
    ("zahrada", "Záhrada"),
    ("ziva-hudba", "Živá hudba"),
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

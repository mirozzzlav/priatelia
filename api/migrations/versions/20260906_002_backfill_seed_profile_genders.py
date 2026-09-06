from alembic import op

revision = "20260906_002"
down_revision = "20260906_001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        UPDATE profiles p
        SET gender = 'male'
        FROM users u
        WHERE u.id = p.user_id
          AND lower(u.nickname) = ANY(
              ARRAY[
                  'mirko',
                  'tomas',
                  'marek',
                  'peter',
                  'adam',
                  'jan',
                  'ján',
                  'robert',
                  'róbert',
                  'daniel',
                  'martin',
                  'matej',
                  'stefan',
                  'štefan'
              ]::text[]
          );
        """
    )
    op.execute(
        """
        UPDATE profiles p
        SET gender = 'female'
        FROM users u
        WHERE u.id = p.user_id
          AND lower(u.nickname) = ANY(
              ARRAY[
                  'nina',
                  'ela',
                  'sara',
                  'lucia',
                  'veronika',
                  'michaela',
                  'zuzana',
                  'katarina',
                  'katarína',
                  'emilia',
                  'emília',
                  'terezia',
                  'terézia',
                  'ivana',
                  'lenka'
              ]::text[]
          );
        """
    )


def downgrade() -> None:
    op.execute(
        """
        UPDATE profiles p
        SET gender = 'unspecified'
        FROM users u
        WHERE u.id = p.user_id
          AND lower(u.nickname) = ANY(
              ARRAY[
                  'mirko',
                  'tomas',
                  'marek',
                  'peter',
                  'adam',
                  'jan',
                  'ján',
                  'robert',
                  'róbert',
                  'daniel',
                  'martin',
                  'matej',
                  'stefan',
                  'štefan',
                  'nina',
                  'ela',
                  'sara',
                  'lucia',
                  'veronika',
                  'michaela',
                  'zuzana',
                  'katarina',
                  'katarína',
                  'emilia',
                  'emília',
                  'terezia',
                  'terézia',
                  'ivana',
                  'lenka'
              ]::text[]
          );
        """
    )

from alembic import op

revision = "20260904_001"
down_revision = "20260902_001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE match_views (
            match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
            PRIMARY KEY (match_id, user_id)
        );

        CREATE INDEX idx_match_views_user ON match_views(user_id);
        """
    )


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS match_views;")

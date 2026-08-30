from alembic import op

revision = "20260830_001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS pgcrypto;")
    op.execute(
        """
        CREATE TABLE users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            nickname TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'active',
            created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );

        CREATE TABLE activation_tokens (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            token TEXT NOT NULL UNIQUE,
            used_at TIMESTAMPTZ,
            expires_at TIMESTAMPTZ NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );

        CREATE TABLE profiles (
            user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
            birth_date DATE NOT NULL,
            location TEXT NOT NULL,
            bio TEXT NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );

        CREATE TABLE profile_photos (
            id TEXT PRIMARY KEY,
            user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
            name TEXT NOT NULL,
            url TEXT NOT NULL,
            is_primary BOOLEAN NOT NULL DEFAULT false,
            position INTEGER NOT NULL DEFAULT 0,
            created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );

        CREATE TABLE discovery_settings (
            user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
            age_from INTEGER NOT NULL DEFAULT 18,
            age_to INTEGER NOT NULL DEFAULT 99,
            location TEXT NOT NULL DEFAULT '',
            updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );

        CREATE TABLE profile_decisions (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            actor_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            target_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            action TEXT NOT NULL CHECK (action IN ('like', 'nope')),
            created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
            UNIQUE (actor_user_id, target_user_id)
        );

        CREATE TABLE matches (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            first_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            second_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
            CHECK (first_user_id < second_user_id),
            UNIQUE (first_user_id, second_user_id)
        );

        CREATE TABLE chat_threads (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            match_id UUID NOT NULL UNIQUE REFERENCES matches(id) ON DELETE CASCADE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );

        CREATE TABLE chat_messages (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            thread_id UUID NOT NULL REFERENCES chat_threads(id) ON DELETE CASCADE,
            sender_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            text TEXT NOT NULL,
            sent_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );

        CREATE TABLE message_reads (
            thread_id UUID NOT NULL REFERENCES chat_threads(id) ON DELETE CASCADE,
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            last_read_at TIMESTAMPTZ NOT NULL DEFAULT now(),
            PRIMARY KEY (thread_id, user_id)
        );

        CREATE TABLE notification_jobs (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            type TEXT NOT NULL,
            recipient_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            payload JSONB NOT NULL DEFAULT '{}'::jsonb,
            status TEXT NOT NULL DEFAULT 'pending',
            attempts INTEGER NOT NULL DEFAULT 0,
            created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
            sent_at TIMESTAMPTZ
        );

        CREATE TABLE outbox_events (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            type TEXT NOT NULL,
            payload JSONB NOT NULL,
            status TEXT NOT NULL DEFAULT 'pending',
            created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
            published_at TIMESTAMPTZ
        );

        CREATE INDEX idx_profile_decisions_actor ON profile_decisions(actor_user_id);
        CREATE INDEX idx_profile_decisions_target ON profile_decisions(target_user_id);
        CREATE INDEX idx_matches_first_user ON matches(first_user_id);
        CREATE INDEX idx_matches_second_user ON matches(second_user_id);
        CREATE INDEX idx_chat_messages_thread_sent ON chat_messages(thread_id, sent_at);
        """
    )


def downgrade() -> None:
    op.execute(
        """
        DROP TABLE IF EXISTS outbox_events;
        DROP TABLE IF EXISTS notification_jobs;
        DROP TABLE IF EXISTS message_reads;
        DROP TABLE IF EXISTS chat_messages;
        DROP TABLE IF EXISTS chat_threads;
        DROP TABLE IF EXISTS matches;
        DROP TABLE IF EXISTS profile_decisions;
        DROP TABLE IF EXISTS discovery_settings;
        DROP TABLE IF EXISTS profile_photos;
        DROP TABLE IF EXISTS profiles;
        DROP TABLE IF EXISTS activation_tokens;
        DROP TABLE IF EXISTS users;
        """
    )

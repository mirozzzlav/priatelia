#!/usr/bin/env bash
set -euo pipefail

APP_DIR=${APP_DIR:-/home/miro/priatelia}
COMPOSE_FILE=${COMPOSE_FILE:-docker-compose.prod.yml}

cd "$APP_DIR"
git pull --ff-only

case "${1:-all}" in
  web)
    docker compose -f "$COMPOSE_FILE" up -d --build --no-deps web
    ;;
  api)
    docker compose -f "$COMPOSE_FILE" up -d --build --no-deps api notification-worker
    docker compose -f "$COMPOSE_FILE" exec -T api alembic upgrade head
    ;;
  all)
    docker compose -f "$COMPOSE_FILE" up -d --build
    docker compose -f "$COMPOSE_FILE" exec -T api alembic upgrade head
    ;;
  *)
    echo "Usage: $0 [web|api|all]" >&2
    exit 1
    ;;
esac

curl -fsS http://127.0.0.1:4445/api/health >/dev/null

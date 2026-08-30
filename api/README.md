# Priatelia API

Minimalisticky Python backend pre modulárny monolit:

- FastAPI pre REST API
- Pydantic pre request/response modely a config
- psycopg3 pre PostgreSQL konektivitu
- Alembic pre migrácie s ručne písaným SQL
- repository pattern pre databázové operácie

## Lokálne spustenie

Preferovaný dev flow je cez Docker Compose z rootu projektu:

```bash
docker compose up --build
```

Migrácie:

```bash
docker compose run --rm api alembic upgrade head
```

Lokálny Python dev flow:

```bash
cd api
pip install -e ".[dev]"
alembic upgrade head
uvicorn app.main:app --reload --port 3000
```

## Moduly

```text
app/modules/auth
app/modules/profiles
app/modules/discovery
app/modules/matching
app/modules/chats
app/modules/notifications
app/shared
```

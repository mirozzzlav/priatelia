from psycopg import AsyncConnection
from psycopg.rows import dict_row
from psycopg_pool import AsyncConnectionPool

from app.shared.config.settings import get_settings

_pool: AsyncConnectionPool | None = None


async def open_database_pool() -> None:
    global _pool
    if _pool is not None:
        return

    _pool = AsyncConnectionPool(
        conninfo=get_settings().database_url,
        check=AsyncConnectionPool.check_connection,
        kwargs={"row_factory": dict_row},
        open=False,
    )
    await _pool.open()


async def close_database_pool() -> None:
    global _pool
    if _pool is None:
        return

    await _pool.close()
    _pool = None


def get_database_pool() -> AsyncConnectionPool:
    if _pool is None:
        raise RuntimeError("Database pool is not open")
    return _pool


async def get_connection() -> AsyncConnection:
    pool = get_database_pool()
    async with pool.connection() as connection:
        yield connection

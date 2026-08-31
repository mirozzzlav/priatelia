import asyncio
import logging

from app.modules.notifications.repository import NotificationRepository
from app.modules.notifications.service import NotificationService
from app.shared.config.settings import get_settings
from app.shared.database.connection import (
    close_database_pool,
    get_database_pool,
    open_database_pool,
)

logger = logging.getLogger(__name__)


async def process_pending_jobs() -> int:
    settings = get_settings()
    pool = get_database_pool()
    processed_count = 0

    async with pool.connection() as connection:
        repository = NotificationRepository(connection)
        service = NotificationService(repository)
        jobs = await repository.claim_pending(
            settings.notification_worker_batch_size,
            settings.notification_worker_max_attempts,
            settings.notification_worker_processing_timeout_seconds,
        )
        await connection.commit()

        for job in jobs:
            try:
                await service.send_job(job)
            except Exception:
                should_retry = job.attempts < settings.notification_worker_max_attempts
                logger.exception(
                    "Notification job %s failed; retry=%s",
                    job.id,
                    should_retry,
                )
                await repository.mark_failed(job.id, should_retry)
            else:
                await repository.mark_sent(job.id)

            await connection.commit()
            processed_count += 1

    return processed_count


async def run_worker() -> None:
    logging.basicConfig(level=logging.INFO)
    settings = get_settings()
    await open_database_pool()

    try:
        while True:
            processed_count = await process_pending_jobs()
            if processed_count == 0:
                await asyncio.sleep(settings.notification_worker_poll_seconds)
    finally:
        await close_database_pool()


def main() -> None:
    asyncio.run(run_worker())


if __name__ == "__main__":
    main()

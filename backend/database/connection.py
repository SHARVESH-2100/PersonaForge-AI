import asyncio
import logging

from pymongo import MongoClient
from pymongo.errors import OperationFailure
from starlette.concurrency import run_in_threadpool

from backend.config import settings
from backend.database.localstore import LocalDatabase

logger = logging.getLogger(__name__)
client = None
database = None
using_local_store = False
_connection_lock = asyncio.Lock()
_CONNECT_ATTEMPTS = 3


def _sync_connect_to_mongo():
    """Create and validate a client before exposing it to request handlers."""
    new_client = MongoClient(settings.MONGODB_URI, serverSelectionTimeoutMS=2000)
    try:
        new_client.admin.command("ping")
        new_database = new_client[settings.DATABASE_NAME]
        try:
            new_database.products.drop_index("unique_product_owner_submission")
        except OperationFailure:
            pass
        new_database.products.create_index(
            [("submission_id", 1)],
            unique=True,
            partialFilterExpression={"submission_id": {"$type": "string"}},
            name="unique_product_submission_id",
        )
        return new_client, new_database
    except Exception:
        new_client.close()
        raise


async def connect_to_mongo() -> None:
    global client, database, using_local_store

    if database is not None:
        return

    async with _connection_lock:
        # Another request may have completed the connection while this request
        # waited for the lock.
        if database is not None:
            return

        last_error = None
        for attempt in range(1, _CONNECT_ATTEMPTS + 1):
            try:
                new_client, new_database = await run_in_threadpool(
                    _sync_connect_to_mongo
                )
                client = new_client
                database = new_database
                using_local_store = False
                logger.info("MongoDB connected successfully.")
                return
            except Exception as exc:
                last_error = exc
                logger.warning(
                    "MongoDB connection attempt %s/%s failed: %s",
                    attempt,
                    _CONNECT_ATTEMPTS,
                    exc,
                )
                if attempt < _CONNECT_ATTEMPTS:
                    await asyncio.sleep(0.2)

        client = None
        using_local_store = True
        database = LocalDatabase()
        logger.warning(
            "MongoDB unavailable (%s). Falling back to local file storage.",
            last_error,
        )


def _sync_close_mongo_connection() -> None:
    global client, database, using_local_store

    if client is not None:
        client.close()
        logger.info("MongoDB connection closed.")
    client = None
    database = None
    using_local_store = False


async def close_mongo_connection() -> None:
    async with _connection_lock:
        await run_in_threadpool(_sync_close_mongo_connection)

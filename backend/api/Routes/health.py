from fastapi import APIRouter, HTTPException
from starlette.concurrency import run_in_threadpool

from backend.database.connection import connect_to_mongo
from backend.database import connection as db_conn


router = APIRouter()


@router.get("/health")
async def health():
    try:
        await connect_to_mongo()
        if db_conn.using_local_store:
            return {"status": "healthy", "database": "local-store"}
        await run_in_threadpool(db_conn.client.admin.command, "ping")
    except Exception as exc:
        raise HTTPException(status_code=503, detail="Database unavailable") from exc

    return {"status": "healthy", "database": "connected"}

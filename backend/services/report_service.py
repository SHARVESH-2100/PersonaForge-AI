from datetime import datetime

from starlette.concurrency import run_in_threadpool
from backend.database.collections import get_reports_collection
from backend.database.connection import connect_to_mongo
from backend.models.report_model import create_report_document
from backend.utils.helpers import serialize_document


async def create_report(report):
    try:
        collection = get_reports_collection()
    except RuntimeError:
        await connect_to_mongo()
        collection = get_reports_collection()
    document = create_report_document(report)

    def _insert(col, doc):
        return col.insert_one(doc)

    result = await run_in_threadpool(_insert, collection, document)
    document["_id"] = result.inserted_id
    return serialize_document(document)


async def list_reports():
    try:
        collection = get_reports_collection()
    except RuntimeError:
        await connect_to_mongo()
        collection = get_reports_collection()

    def _find_list(col):
        return list(col.find().limit(100))

    documents = await run_in_threadpool(_find_list, collection)
    return [serialize_document(document) for document in documents]


async def get_product_report(product_id: str):
    try:
        collection = get_reports_collection()
    except RuntimeError:
        await connect_to_mongo()
        collection = get_reports_collection()

    def _find(col, pid):
        return col.find_one({"product_id": pid}, sort=[("created_at", -1)])

    document = await run_in_threadpool(_find, collection, str(product_id))
    return serialize_document(document) if document is not None else None


async def get_or_create_product_report(
    product: dict,
    analysis: str | None = None,
    probability: int | None = None,
    risk_analysis: str | None = None,
    risk_level: str | None = None,
    risk_score: int | None = None,
):
    try:
        collection = get_reports_collection()
    except RuntimeError:
        await connect_to_mongo()
        collection = get_reports_collection()

    product_id = str(product["_id"])
    existing = await run_in_threadpool(
        collection.find_one, {"product_id": product_id}, sort=[("created_at", -1)]
    )
    if existing is not None:
        return serialize_document(existing)

    if analysis is None:
        return None

    document = {
        "product_id": product_id,
        "title": f"Validation report: {product['product_name']}",
        "summary": analysis,
        "probability": probability,
        "risk_analysis": risk_analysis,
        "risk_level": risk_level,
        "risk_score": risk_score,
        "created_at": datetime.utcnow(),
    }
    result = await run_in_threadpool(collection.insert_one, document)
    document["_id"] = result.inserted_id
    return serialize_document(document)

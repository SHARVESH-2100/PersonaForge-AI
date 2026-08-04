from starlette.concurrency import run_in_threadpool
from pymongo.errors import DuplicateKeyError
from backend.database.collections import get_products_collection
from backend.database.connection import connect_to_mongo
from backend.models.product_model import create_product_document
from backend.utils.helpers import serialize_document


async def create_product(product):
    try:
        collection = get_products_collection()
    except RuntimeError:
        # try to (re)connect then get collection again
        await connect_to_mongo()
        collection = get_products_collection()
    document = create_product_document(product)

    try:
        result = await run_in_threadpool(collection.insert_one, document)
        document["_id"] = result.inserted_id
        return serialize_document(document)
    except DuplicateKeyError:
        existing = await run_in_threadpool(
            collection.find_one, {"submission_id": product.submission_id}
        )
        if existing is None:
            raise
        return serialize_document(existing)


async def list_products():
    try:
        collection = get_products_collection()
    except RuntimeError:
        await connect_to_mongo()
        collection = get_products_collection()

    def _find_list(col):
        return list(col.find().sort("created_at", -1).limit(100))

    documents = await run_in_threadpool(_find_list, collection)
    return [serialize_document(document) for document in documents]


async def delete_product(product_id: str) -> bool:
    from bson.objectid import ObjectId
    from backend.utils.helpers import parse_object_id

    try:
        collection = get_products_collection()
    except RuntimeError:
        await connect_to_mongo()
        collection = get_products_collection()

    try:
        object_id = parse_object_id(product_id)
    except ValueError:
        object_id = None

    query = {"_id": object_id} if object_id is not None else {"submission_id": product_id}
    result = await run_in_threadpool(collection.delete_one, query)
    return bool(result.deleted_count)

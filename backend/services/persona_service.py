from starlette.concurrency import run_in_threadpool
from backend.database.collections import get_personas_collection
from backend.database.connection import connect_to_mongo
from backend.models.persona_model import create_persona_document
from backend.utils.helpers import serialize_document


async def create_persona(persona):
    try:
        collection = get_personas_collection()
    except RuntimeError:
        await connect_to_mongo()
        collection = get_personas_collection()
    document = create_persona_document(persona)

    def _insert(col, doc):
        return col.insert_one(doc)

    result = await run_in_threadpool(_insert, collection, document)
    document["_id"] = result.inserted_id
    return serialize_document(document)


async def list_personas():
    try:
        collection = get_personas_collection()
    except RuntimeError:
        await connect_to_mongo()
        collection = get_personas_collection()

    def _find_list(col):
        return list(col.find().limit(100))

    documents = await run_in_threadpool(_find_list, collection)
    return [serialize_document(document) for document in documents]

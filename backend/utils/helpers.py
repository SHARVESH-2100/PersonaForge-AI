from datetime import datetime
from typing import Any

from bson import ObjectId


def serialize_document(document: Any) -> dict[str, Any]:
    if document is None:
        return {}

    payload = dict(document)
    object_id = payload.pop("_id", None)
    payload["id"] = str(object_id) if object_id is not None else None
    return payload


def parse_object_id(object_id: str) -> ObjectId:
    try:
        return ObjectId(object_id)
    except Exception as exc:
        raise ValueError("Invalid object id") from exc


def utc_now() -> datetime:
    return datetime.utcnow()

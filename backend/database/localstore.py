"""File-based fallback storage used when MongoDB is unreachable.

Implements the small subset of the pymongo Collection API that the
services layer relies on, persisting documents as JSON files so the
application remains fully functional in local / offline mode.
"""

import json
import logging
import threading
from datetime import datetime
from pathlib import Path
from types import SimpleNamespace
from typing import Any, Iterable, Iterator, Optional

from bson import ObjectId
from pymongo.errors import DuplicateKeyError

logger = logging.getLogger(__name__)

DEFAULT_DIR = Path(__file__).resolve().parent.parent / ".localdb"


def _default(value: Any) -> Any:
    if isinstance(value, datetime):
        return {"$date": value.isoformat()}
    if isinstance(value, ObjectId):
        return {"$oid": str(value)}
    raise TypeError(f"Object of type {type(value).__name__} is not JSON serializable")


def _restore(value: Any) -> Any:
    if isinstance(value, dict):
        if set(value.keys()) == {"$date"}:
            return datetime.fromisoformat(value["$date"])
        if set(value.keys()) == {"$oid"}:
            return ObjectId(value["$oid"])
        return {k: _restore(v) for k, v in value.items()}
    if isinstance(value, list):
        return [_restore(v) for v in value]
    return value


def _matches(document: dict, query: dict) -> bool:
    for key, expected in query.items():
        actual = document.get(key)
        if key == "_id":
            if str(actual) != str(expected):
                return False
            continue
        if isinstance(expected, dict) and set(expected.keys()) == {"$type"}:
            continue
        if actual != expected:
            return False
    return True


class LocalCursor:
    def __init__(self, documents: Iterable[dict]):
        self._documents = list(documents)

    def limit(self, limit: int) -> "LocalCursor":
        return LocalCursor(self._documents[:limit])

    def sort(self, key_or_list, direction: Optional[int] = None) -> "LocalCursor":
        if isinstance(key_or_list, str):
            pairs = [(key_or_list, direction or 1)]
        else:
            pairs = list(key_or_list)
        documents = list(self._documents)
        for key, direction in reversed(pairs):
            documents.sort(
                key=lambda doc: doc.get(key),
                reverse=direction < 0,
            )
        return LocalCursor(documents)

    def __iter__(self) -> Iterator[dict]:
        return iter(self._documents)

    def __len__(self) -> int:
        return len(self._documents)


class LocalCollection:
    def __init__(self, path: Path):
        self._path = path
        self._documents: list[dict] = []
        self._lock = threading.Lock()
        self._load()

    def _load(self) -> None:
        if not self._path.exists():
            return
        try:
            raw = json.loads(self._path.read_text(encoding="utf-8"))
            self._documents = [_restore(item) for item in raw]
        except (json.JSONDecodeError, OSError) as exc:
            logger.warning("Could not load local store %s: %s", self._path, exc)

    def _save(self) -> None:
        self._path.parent.mkdir(parents=True, exist_ok=True)
        self._path.write_text(
            json.dumps(self._documents, default=_default, indent=2),
            encoding="utf-8",
        )

    def insert_one(self, document: dict) -> SimpleNamespace:
        with self._lock:
            if "_id" not in document:
                document["_id"] = ObjectId()
            for existing in self._documents:
                if existing.get("submission_id") and existing.get("submission_id") == document.get("submission_id"):
                    raise DuplicateKeyError(
                        f"duplicate key error: submission_id {document.get('submission_id')}"
                    )
            self._documents.append(document)
            self._save()
        return SimpleNamespace(inserted_id=document["_id"])

    def find_one(self, query: Optional[dict] = None, sort=None, *args, **kwargs) -> Optional[dict]:
        query = query or {}
        with self._lock:
            documents = [doc for doc in self._documents if _matches(doc, query)]
        if not documents:
            return None
        if sort:
            cursor = LocalCursor(documents).sort(sort)
            documents = list(cursor)
        return documents[0]

    def find(self, query: Optional[dict] = None, *args, **kwargs) -> LocalCursor:
        query = query or {}
        with self._lock:
            documents = [doc for doc in self._documents if _matches(doc, query)]
        return LocalCursor(documents)

    def delete_one(self, query: Optional[dict] = None, *args, **kwargs) -> SimpleNamespace:
        query = query or {}
        with self._lock:
            index = next(
                (i for i, doc in enumerate(self._documents) if _matches(doc, query)),
                None,
            )
            if index is None:
                return SimpleNamespace(deleted_count=0)
            del self._documents[index]
            self._save()
        return SimpleNamespace(deleted_count=1)


class LocalDatabase:
    def __init__(self, directory: Path = DEFAULT_DIR):
        self._directory = directory
        self._collections: dict[str, LocalCollection] = {}
        self._lock = threading.Lock()

    def __getitem__(self, name: str) -> LocalCollection:
        with self._lock:
            if name not in self._collections:
                safe = "".join(ch if ch.isalnum() or ch in "._-" else "_" for ch in name)
                self._collections[name] = LocalCollection(self._directory / f"{safe}.json")
            return self._collections[name]

    def list_collection_names(self) -> list[str]:
        with self._lock:
            return list(self._collections.keys())

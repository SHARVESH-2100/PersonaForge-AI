from typing import Any

from backend.database import connection as db_conn


def get_collection(name: str) -> Any:
    if db_conn.database is None:
        raise RuntimeError("MongoDB is not connected. Call connect_to_mongo() first.")

    return db_conn.database[name]


def get_products_collection() -> Any:
    return get_collection("products")


def get_personas_collection() -> Any:
    return get_collection("personas")


def get_reports_collection() -> Any:
    return get_collection("reports")


def get_feedback_collection() -> Any:
    return get_collection("feedback")


def get_users_collection() -> Any:
    return get_collection("users")

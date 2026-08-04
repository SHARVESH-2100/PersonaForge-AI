from datetime import datetime

from backend.schemas.product_schema import ProductCreate


def create_product_document(product: ProductCreate) -> dict:
    document = product.model_dump(exclude_none=True)
    document["created_at"] = datetime.utcnow()
    return document

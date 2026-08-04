from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class ProductCreate(BaseModel):
    submission_id: str = Field(..., min_length=8, max_length=128)
    product_name: str = Field(..., min_length=2)
    description: str = Field(..., min_length=10)
    category: str
    price: float = Field(..., gt=0)
    target_audience: str
    currency: Optional[str] = Field(default="USD", max_length=3)
    product_image: Optional[str] = None


class ProductRead(ProductCreate):
    id: str
    created_at: datetime

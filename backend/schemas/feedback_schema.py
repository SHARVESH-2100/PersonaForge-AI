from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class FeedbackCreate(BaseModel):
    author: str = Field(..., min_length=2)
    message: str = Field(..., min_length=5)
    rating: Optional[int] = Field(None, ge=1, le=5)


class FeedbackRead(FeedbackCreate):
    id: str
    created_at: datetime

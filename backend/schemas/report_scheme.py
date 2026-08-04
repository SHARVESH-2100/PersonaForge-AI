from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class ReportCreate(BaseModel):
    title: str = Field(..., min_length=3)
    summary: str = Field(..., min_length=10)
    recommendations: Optional[str] = None


class ReportRead(ReportCreate):
    id: str
    created_at: datetime

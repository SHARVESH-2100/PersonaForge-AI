from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class PersonaCreate(BaseModel):
    name: str = Field(..., min_length=2)
    profession: str
    country: str
    age: Optional[int] = None
    behaviour: Optional[str] = None
    probability: Optional[int] = Field(None, ge=0, le=100)
    confidence: Optional[int] = Field(None, ge=0, le=100)
    trigger: Optional[str] = None
    objection: Optional[str] = None


class PersonaRead(PersonaCreate):
    id: str
    created_at: datetime

from datetime import datetime

from backend.schemas.persona_model import PersonaCreate


def create_persona_document(persona: PersonaCreate) -> dict:
    document = persona.model_dump(exclude_none=True)
    document["created_at"] = datetime.utcnow()
    return document

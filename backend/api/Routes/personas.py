from fastapi import APIRouter, HTTPException

from backend.schemas.persona_model import PersonaCreate, PersonaRead
from backend.services.persona_service import create_persona, list_personas

router = APIRouter()


@router.get("/", response_model=list[PersonaRead])
async def get_personas():
    return await list_personas()


@router.post("/", response_model=PersonaRead, status_code=201)
async def add_persona(persona: PersonaCreate):
    try:
        return await create_persona(persona)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from starlette.concurrency import run_in_threadpool

from backend.ai.gemini import generate_text


class AnalyzeRequest(BaseModel):
    prompt: str = Field(..., min_length=10)


class AnalyzeResponse(BaseModel):
    prompt: str
    result: str


router = APIRouter()


@router.post("/", response_model=AnalyzeResponse)
async def analyze(prompt_request: AnalyzeRequest):
    try:
        result = await run_in_threadpool(generate_text, prompt_request.prompt)
        return AnalyzeResponse(prompt=prompt_request.prompt, result=result)
    except Exception as exc:
        raise HTTPException(status_code=503, detail=str(exc))

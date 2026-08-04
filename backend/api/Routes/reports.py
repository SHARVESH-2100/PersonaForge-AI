from fastapi import APIRouter, HTTPException

from backend.schemas.report_scheme import ReportCreate, ReportRead
from backend.services.report_service import create_report, list_reports

router = APIRouter()


@router.get("/", response_model=list[ReportRead])
async def get_reports():
    return await list_reports()


@router.post("/", response_model=ReportRead, status_code=201)
async def add_report(report: ReportCreate):
    try:
        return await create_report(report)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

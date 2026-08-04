from datetime import datetime

from backend.schemas.report_scheme import ReportCreate


def create_report_document(report: ReportCreate) -> dict:
    document = report.model_dump(exclude_none=True)
    document["created_at"] = datetime.utcnow()
    return document

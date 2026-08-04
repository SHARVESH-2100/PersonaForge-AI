from datetime import datetime

from backend.schemas.feedback_schema import FeedbackCreate


def create_feedback_document(feedback: FeedbackCreate) -> dict:
    document = feedback.model_dump(exclude_none=True)
    document["created_at"] = datetime.utcnow()
    return document

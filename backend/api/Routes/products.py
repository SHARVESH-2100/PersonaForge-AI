import logging
import re

from fastapi import APIRouter, HTTPException
from pymongo.errors import PyMongoError
from starlette.concurrency import run_in_threadpool

from backend.schemas.product_schema import ProductCreate
from backend.ai.gemini import generate_text
from backend.ai.risk_analyze import analyze_product_risk
from backend.ai.simulation_generator import generate_simulation
from backend.database.collections import get_products_collection
from backend.database.connection import connect_to_mongo
from backend.services.product_services import create_product, delete_product, list_products
from backend.services.report_service import get_or_create_product_report, get_product_report
from backend.utils.helpers import parse_object_id, serialize_document


router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/")
async def add_product(product: ProductCreate):
    try:
        result = await create_product(product)
    except PyMongoError as exc:
        raise HTTPException(status_code=503, detail="Database unavailable") from exc
    return {
        "message": "Product created successfully.",
        "product": result
    }


@router.get("/")
async def get_products():
    try:
        return {"products": await list_products()}
    except PyMongoError as exc:
        raise HTTPException(status_code=503, detail="Database unavailable") from exc


@router.delete("/{product_id}")
async def remove_product(product_id: str):
    try:
        deleted = await delete_product(product_id)
    except PyMongoError as exc:
        raise HTTPException(status_code=503, detail="Database unavailable") from exc
    if not deleted:
        raise HTTPException(status_code=404, detail="Product not found.")
    return {"message": "Product deleted successfully."}


@router.post("/{product_id}/validate")
async def validate_product(product_id: str):
    try:
        try:
            collection = get_products_collection()
        except RuntimeError:
            await connect_to_mongo()
            collection = get_products_collection()

        try:
            object_id = parse_object_id(product_id)
        except ValueError:
            object_id = None

        if object_id is not None:
            product = await run_in_threadpool(collection.find_one, {"_id": object_id})
        else:
            product = await run_in_threadpool(
                collection.find_one, {"submission_id": product_id}
            )

        if product is None:
            raise HTTPException(status_code=404, detail="Product not found.")

        existing = await get_or_create_product_report(product)
        if existing:
            return {"report": existing, "cached": True}
    except PyMongoError as exc:
        raise HTTPException(status_code=503, detail="Database unavailable") from exc

    prompt = f"""You are a rigorous product-validation analyst. Analyse this product and provide a concise, evidence-aware validation report. Do not invent market research or claim certainty.

Product name: {product['product_name']}
Category: {product['category']}
Price: {product['price']}
Target audience: {product['target_audience']}
Description: {product['description']}

Start with one line exactly in the form: Probability: NN%
where NN is a number from 0 to 100 estimating how likely this product is to succeed.

Then use these exact Markdown sections:
## Validation summary
## Buyer fit
## Risks and assumptions
## Recommended next tests
Give 3 to 5 specific next tests."""
    try:
        analysis = await run_in_threadpool(generate_text, prompt, None, 900)
        probability = None
        match = re.search(r"Probability:\s*(\d{1,3})%?", analysis)
        if match:
            probability = min(max(int(match.group(1)), 0), 100)

        risk = None
        try:
            risk = await run_in_threadpool(analyze_product_risk, product)
        except Exception as exc:
            logger.warning("Risk analysis failed for product %s: %s", product_id, exc)

        report = await get_or_create_product_report(
            product,
            analysis,
            probability,
            risk_analysis=risk["analysis"] if risk else None,
            risk_level=risk["risk_level"] if risk else None,
            risk_score=risk["risk_score"] if risk else None,
        )
        return {"report": report, "cached": False}
    except Exception as exc:
        raise HTTPException(status_code=503, detail="AI validation is currently unavailable.") from exc


async def _fetch_product(product_id: str):
    try:
        collection = get_products_collection()
    except RuntimeError:
        await connect_to_mongo()
        collection = get_products_collection()

    try:
        object_id = parse_object_id(product_id)
    except ValueError:
        object_id = None

    if object_id is not None:
        product = await run_in_threadpool(collection.find_one, {"_id": object_id})
    else:
        product = await run_in_threadpool(
            collection.find_one, {"submission_id": product_id}
        )
    return product


@router.get("/{product_id}/report")
async def get_product_report_endpoint(product_id: str):
    product = await _fetch_product(product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found.")
    report = await get_product_report(product["_id"])
    if report is None:
        raise HTTPException(status_code=404, detail="No validation report has been generated for this product yet.")
    return {"product": serialize_document(product), "report": report}


@router.post("/{product_id}/simulate")
async def simulate_product(product_id: str):
    try:
        product = await _fetch_product(product_id)
    except PyMongoError as exc:
        raise HTTPException(status_code=503, detail="Database unavailable") from exc
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found.")

    simulation = await run_in_threadpool(generate_simulation, product)
    if not simulation:
        raise HTTPException(
            status_code=503, detail="AI simulation is currently unavailable."
        )
    return simulation

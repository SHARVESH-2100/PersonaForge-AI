import json
import logging
import re

import google.generativeai as genai

from backend.config import settings

logger = logging.getLogger(__name__)

MODEL_NAME = "gemini-3-flash-preview"

if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

AVATARS = [
    "https://i.pravatar.cc/48?img=47",
    "https://i.pravatar.cc/48?img=68",
    "https://i.pravatar.cc/48?img=45",
    "https://i.pravatar.cc/48?img=12",
    "https://i.pravatar.cc/48?img=44",
    "https://i.pravatar.cc/48?img=33",
    "https://i.pravatar.cc/48?img=8",
    "https://i.pravatar.cc/48?img=32",
]

SENTIMENTS = {"positive", "neutral", "negative"}


def _clean_json(text: str) -> str:
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text, flags=re.MULTILINE)
    text = re.sub(r"\s*```$", "", text, flags=re.MULTILINE)
    return text.strip()


def _parse_simulation(product: dict, raw: str):
    data = json.loads(raw)
    if isinstance(data, dict) and "personas" in data:
        data = data["personas"]
    if not isinstance(data, list):
        raise ValueError("expected a JSON array")

    simulation = []
    for index, item in enumerate(data[:6]):
        probability = int(item.get("probability", 50))
        confidence = int(item.get("confidence", 70))
        sentiment = str(item.get("sentiment", "neutral")).lower()
        if sentiment not in SENTIMENTS:
            sentiment = "neutral"
        simulation.append(
            {
                "id": index + 1,
                "name": str(item.get("name", f"Persona {index + 1}")),
                "age": int(item.get("age", 30)),
                "role": str(item.get("role", "Customer")),
                "income": str(item.get("income", "Medium")),
                "behaviour": str(item.get("behaviour", "Considered buyer")),
                "personality": str(item.get("personality", "Practical")),
                "sentiment": sentiment,
                "emotion": str(item.get("emotion", "😐 Neutral")),
                "topic": str(item.get("topic", "Value")),
                "probability": min(100, max(0, probability)),
                "confidence": min(100, max(0, confidence)),
                "text": str(item.get("text", "I need to think about this.")),
                "avatar": AVATARS[index % len(AVATARS)],
            }
        )

    total_weight = sum(r["confidence"] for r in simulation) or 1
    aggregate = round(
        sum(r["probability"] * r["confidence"] for r in simulation) / total_weight
    )

    return {
        "aggregate": aggregate,
        "simulation": simulation,
        "product_id": product.get("id"),
    }


def generate_simulation(product: dict):
    """
    Generate a live customer simulation for a product.

    Asks Gemini to role-play independent personas and return structured
    decisions (probability + confidence + sentiment) so the aggregate
    buy-likelihood can be computed as a confidence-weighted average.
    """
    model = genai.GenerativeModel(MODEL_NAME)

    prompt = f"""
You are a customer-behaviour simulation engine.

Product Name:
{product.get('product_name', '')}

Product Description:
{product.get('description', '')}

Target Audience:
{product.get('target_audience', '')}

Category:
{product.get('category', '')}

Price:
{product.get('price', '')} {product.get('currency', 'USD')}

Create 6 realistic independent customers for this product. For each customer
simulate whether they would buy and why. Imagine each one reads the product
brief, weighs price vs. value, and announces a decision out loud.

Return ONLY a valid JSON array. No markdown, no commentary. Each object must
have exactly these fields:

- "name": first name only
- "age": number
- "role": short occupation
- "income": "Low" | "Medium" | "High"
- "behaviour": one short buying-behaviour phrase
- "personality": one short personality trait
- "sentiment": "positive" | "neutral" | "negative"
- "emotion": one short emoji + feeling, e.g. "🤔 Skeptical"
- "topic": short concern, e.g. "Value", "Usability", "Price"
- "probability": integer 0-100, the chance this customer buys
- "confidence": integer 0-100, how sure this customer is
- "text": a spoken line, 1-2 sentences, first person, as if this customer is
  talking to the founder in the live debate

Make probability and confidence internally consistent: low confidence should
pull the probability toward 50; a "negative" sentiment should rarely have a
probability above 30.
"""

    try:
        response = model.generate_content(
            prompt,
            generation_config={
                "response_mime_type": "application/json",
                "max_output_tokens": 4096,
                "temperature": 0.9,
            },
        )
        raw = _clean_json(response.text)
        return _parse_simulation(product, raw)

    except Exception as exc:
        logger.warning("Simulation generation failed: %s", exc)
        try:
            fallback = model.generate_content(
                "Create 6 customers who decide whether to buy this product. "
                f"Product: {product.get('product_name')}. "
                "Return ONLY a JSON array. Each item: {\"name\":string,\"age\":number,"
                "\"role\":string,\"income\":\"Low\"|\"Medium\"|\"High\","
                "\"behaviour\":string,\"personality\":string,"
                "\"sentiment\":\"positive\"|\"neutral\"|\"negative\","
                "\"emotion\":string,\"topic\":string,"
                "\"probability\":0-100,\"confidence\":0-100,\"text\":string(1-2 sentences)}",
                generation_config={
                    "response_mime_type": "application/json",
                    "max_output_tokens": 4096,
                    "temperature": 0.8,
                },
            )
            return _parse_simulation(product, _clean_json(fallback.text))
        except Exception as retry_exc:
            logger.warning("Simulation fallback failed: %s", retry_exc)
            return None

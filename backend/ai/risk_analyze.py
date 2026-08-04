import re

from backend.ai.gemini import generate_text

RISK_LEVELS = ("Low", "Medium", "High")

RISK_CATEGORIES = (
    "Market risk",
    "Technical risk",
    "Financial risk",
    "User adoption risk",
    "Competitor risk",
)

DEFAULT_RISK_SCORE = 50


def build_risk_prompt(product: dict) -> str:
    """Build a focused prompt that asks Gemini to score launch risk."""

    return f"""You are a startup consultant specialising in pre-launch risk assessment.

Analyse the following product and estimate how risky it would be to launch today.

Product Name:
{product['product_name']}

Category:
{product['category']}

Price:
{product['price']}

Target Audience:
{product['target_audience']}

Product Description:
{product['description']}

Identify and score each of these risk categories from 0 to 100:

1. Market Risk
2. Technical Risk
3. Financial Risk
4. User Adoption Risk
5. Competitor Risk

For each category give a one-line reason and a score on its own line in the form:
Market Risk: NN/100 - reason
Technical Risk: NN/100 - reason
Financial Risk: NN/100 - reason
User Adoption Risk: NN/100 - reason
Competitor Risk: NN/100 - reason

Then conclude with these two lines, exactly in this form:

Overall Risk Score: NN/100
Risk Level: Low|Medium|High

Finally, list 3 to 5 specific suggestions to reduce the biggest risks. Keep the whole response concise and in markdown.
"""


def _extract_risk_level(analysis: str) -> str:
    match = re.search(
        r"[Rr]isk [Ll]evel\s*[:.-]?\s*(low|medium|high)", analysis
    )
    if match is None:
        return RISK_LEVELS[1]
    return match.group(1).capitalize()


def _extract_risk_score(analysis: str) -> int:
    match = re.search(
        r"Overall [Rr]isk [Ss]core\s*[:.-]?\s*(\d{1,3})\s*%?", analysis
    )
    if match is not None:
        return min(max(int(match.group(1)), 0), 100)

    match = re.search(r"[Rr]isk [Ss]core\s*[:.-]?\s*(\d{1,3})\s*%?", analysis)
    if match is not None:
        return min(max(int(match.group(1)), 0), 100)

    return {"Low": 25, "Medium": 50, "High": 80}.get(
        _extract_risk_level(analysis), DEFAULT_RISK_SCORE
    )


def analyze_risk(product: dict) -> str:
    """Run the risk analysis with Gemini and return the raw markdown text."""
    return generate_text(build_risk_prompt(product), None, 1000)


def analyze_product_risk(product: dict) -> dict:
    """Analyse a product's launch risk and return structured results.

    Returns:
        {
            "analysis": str,   # markdown breakdown from Gemini
            "risk_level": str, # Low | Medium | High
            "risk_score": int  # 0-100
        }
    """
    analysis = analyze_risk(product)
    return {
        "analysis": analysis,
        "risk_level": _extract_risk_level(analysis),
        "risk_score": _extract_risk_score(analysis),
    }

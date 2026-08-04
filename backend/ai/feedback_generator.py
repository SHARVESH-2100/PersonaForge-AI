import google.generativeai as genai
from backend.config import settings

# Configure Gemini API
genai.configure(api_key=settings.GEMINI_API_KEY)

# Load Gemini Model
model = genai.GenerativeModel("gemini-3-flash-preview")


def generate_feedback(product_name: str, product_description: str, personas: list):
    """
    Generate AI feedback based on the generated personas.
    """

    prompt = f"""
You are an expert product validation consultant.

Product Name:
{product_name}

Product Description:
{product_description}

Customer Personas:
{personas}

Analyze the product and generate:

1. Overall Product Rating (1-10)
2. Strengths
3. Weaknesses
4. Customer Pain Points
5. Suggested Improvements
6. Market Potential
7. Final Recommendation (Launch / Improve Before Launch)

Return the response in clear markdown.
"""

    response = model.generate_content(prompt)

    return response.text
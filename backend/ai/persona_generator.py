import google.generativeai as genai
from backend.config import settings

# Configure Gemini API
genai.configure(api_key=settings.GEMINI_API_KEY)

# Load Gemini Model
model = genai.GenerativeModel("gemini-3-flash-preview")


def generate_personas(product_name: str, product_description: str):
    """
    Generate AI customer personas for the given product.
    """

    prompt = f"""
You are an expert UX researcher and marketing analyst.

Generate 3 realistic customer personas for the following product.

Product Name:
{product_name}

Product Description:
{product_description}

For each persona include:

1. Name
2. Age
3. Occupation
4. Location
5. Interests
6. Goals
7. Pain Points
8. Buying Motivation
9. Likelihood of Purchasing (Low / Medium / High)

Return the response in markdown format.
"""

    try:
        response = model.generate_content(prompt)
        return response.text

    except Exception as e:
        return f"Persona generation failed: {str(e)}"
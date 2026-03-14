import anthropic
import json
from typing import TypedDict

client = anthropic.Anthropic()


class ProductData(TypedDict):
    name: str
    price: float
    category: str
    description: str | None


DEFAULTS: ProductData = {"name": "Unknown Product", "price": 0.0, "category": "uncategorized", "description": None}

SYSTEM_PROMPT = """Extract product data from descriptions. Output ONLY valid JSON:
{"name": "<name>", "price": <number>, "category": "<category>", "description": "<optional>"}
No markdown. price must be a number."""


def validate_product(data: dict) -> str | None:
    if not isinstance(data, dict): return "Must be a JSON object"
    if not isinstance(data.get("name"), str) or not data["name"]: return "Missing/invalid 'name'"
    if not isinstance(data.get("price"), (int, float)): return f"'price' must be number, got {type(data.get('price')).__name__}"
    if data["price"] < 0: return f"'price' is negative: {data['price']}"
    if not isinstance(data.get("category"), str) or not data["category"]: return "Missing/invalid 'category'"
    return None


def extract_product_data(description: str) -> ProductData:
    messages = [{"role": "user", "content": f"Extract product data:\n\n{description}"}]

    for _ in range(3):
        response = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=256,
            temperature=0,
            system=SYSTEM_PROMPT,
            messages=messages,
        )
        raw = response.content[0].text
        cleaned = raw.strip().lstrip("```json\n").rstrip("```").strip()

        try:
            parsed = json.loads(cleaned)
        except json.JSONDecodeError:
            messages.append({"role": "assistant", "content": raw})
            messages.append({"role": "user", "content": "Invalid JSON. Respond with ONLY a valid JSON object."})
            continue

        error = validate_product(parsed)
        if not error:
            return {**DEFAULTS, **parsed}

        messages.append({"role": "assistant", "content": raw})
        messages.append({"role": "user", "content": f"Validation failed: {error}. Fix this specific issue."})

    return DEFAULTS


descriptions = [
    "The ProMax Laptop 15 — M3 chip, starting at $1,299.",
    "Fresh organic bananas. Price: $2.49. Category: produce.",
    "Wireless headphones. MSRP $249.99. Electronics.",
]

for i, desc in enumerate(descriptions):
    print(f"\n{i+1}:", extract_product_data(desc))

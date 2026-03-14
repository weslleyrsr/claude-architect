import anthropic
import json
from typing import TypedDict

client = anthropic.Anthropic()


class ProductData(TypedDict):
    name: str
    price: float
    category: str
    description: str | None


def validate_product(data: dict) -> str | None:
    """Return error message if invalid, None if valid"""
    # TODO: Check name, price (number, non-negative), category
    return None


def extract_product_data(description: str) -> ProductData:
    """TODO: Extract with validation + corrective retry"""
    return ProductData(name="Unknown", price=0.0, category="unknown", description=None)


descriptions = [
    "The ProMax Laptop 15 — ultra-thin aluminum chassis, M3 chip, starting at $1,299.",
    "Fresh organic bananas, sold by the bunch. Price: $2.49. Category: produce.",
    "Wireless noise-canceling headphones. 30hr battery. MSRP $249.99. Electronics.",
]

for i, desc in enumerate(descriptions):
    print(f"\n{i+1}:", extract_product_data(desc))

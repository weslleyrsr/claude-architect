import anthropic
from dataclasses import dataclass

client = anthropic.Anthropic()


@dataclass
class ReviewResult:
    initial: str
    critique: str
    revised: str


def call_claude(system: str, user_message: str) -> str:
    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=1024,
        system=system,
        messages=[{"role": "user", "content": user_message}],
    )
    return response.content[0].text


def generate_with_review(code: str) -> ReviewResult:
    # Step 1: Generate initial documentation
    initial = call_claude(
        "You are a technical documentation writer. Write clear, accurate docstring documentation. Include: purpose, parameters with types, return value, edge cases.",
        f"Write documentation for:\n\n{code}"
    )

    # Step 2: Independent critic (fresh context — no generator reasoning)
    critique = call_claude(
        "You are a documentation reviewer. Critically evaluate documentation for accuracy, completeness, and clarity. Check all parameters, return types, and edge cases. Be specific.",
        f"Review this documentation for the code below.\n\nCode:\n{code}\n\nDocumentation:\n{initial}\n\nProvide specific critique."
    )

    # Step 3: Revise based on critique
    revised = call_claude(
        "You are a technical documentation writer. Revise documentation based on critic feedback. Address every point.",
        f"Revise this documentation based on the critique.\n\nCode:\n{code}\n\nOriginal:\n{initial}\n\nCritique:\n{critique}\n\nImproved documentation:"
    )

    return ReviewResult(initial=initial, critique=critique, revised=revised)


sample_code = """
def calculate_discount(price: float, user_tier: str) -> float:
    if user_tier == 'premium':
        return price * 0.8
    if user_tier == 'gold':
        return price * 0.9
    return price
"""

result = generate_with_review(sample_code)
print("=== Initial ===\n", result.initial)
print("\n=== Critique ===\n", result.critique)
print("\n=== Revised ===\n", result.revised)

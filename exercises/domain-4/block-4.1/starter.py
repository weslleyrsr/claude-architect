import anthropic
import json
from typing import TypedDict, Literal

client = anthropic.Anthropic()


class ClassificationResult(TypedDict):
    category: Literal["billing", "technical", "account", "feature-request"]
    confidence: Literal["high", "medium", "low"]
    reasoning: str


async def classify_ticket(text: str) -> ClassificationResult:
    """
    TODO: Implement the ticket classifier
    Requirements:
    1. System prompt with role + JSON format specification
    2. At least 3 few-shot examples in the user message
    3. Temperature 0
    4. Returns structured ClassificationResult
    5. Handles JSON parse errors
    """
    return ClassificationResult(
        category="technical",
        confidence="low",
        reasoning="Not implemented yet",
    )


import asyncio


async def main():
    tickets = [
        "I was charged twice for my subscription last month",
        "The app crashes when I upload files larger than 10MB",
        "I'd love to see dark mode on the dashboard",
        "I can't log in — it says my password is wrong but I just reset it",
    ]

    for ticket in tickets:
        print(f'\nTicket: "{ticket}"')
        result = await classify_ticket(ticket)
        print(f"Result: {result}")


asyncio.run(main())

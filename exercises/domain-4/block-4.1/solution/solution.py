import anthropic
import json
import asyncio
from typing import TypedDict, Literal

client = anthropic.Anthropic()


class ClassificationResult(TypedDict):
    category: Literal["billing", "technical", "account", "feature-request"]
    confidence: Literal["high", "medium", "low"]
    reasoning: str


SYSTEM_PROMPT = """You are a customer support ticket classifier for a SaaS platform.

Classify each ticket into one of these categories:
- billing: payment, charges, invoices, refunds, subscriptions
- technical: bugs, errors, crashes, performance issues, API problems
- account: login, password, profile, permissions, account settings
- feature-request: new features, improvements, suggestions

Output ONLY valid JSON in this exact format (no markdown):
{"category": "<category>", "confidence": "high|medium|low", "reasoning": "<one sentence>"}"""


def classify_ticket(text: str) -> ClassificationResult:
    few_shot = f"""
Ticket: "My invoice shows $99 but I should be on the $49 plan"
{{"category": "billing", "confidence": "high", "reasoning": "Directly about pricing and invoice amounts."}}

Ticket: "The export button doesn't work in Chrome"
{{"category": "technical", "confidence": "high", "reasoning": "Browser-specific bug with a UI element."}}

Ticket: "Can you add bulk-select to the list view?"
{{"category": "feature-request", "confidence": "high", "reasoning": "Requesting new functionality."}}

Ticket: "I forgot my password and the reset email isn't arriving"
{{"category": "account", "confidence": "high", "reasoning": "Account access issue via password reset."}}

Ticket: "{text}"
"""

    try:
        response = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=256,
            temperature=0,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": few_shot}],
        )
        raw = response.content[0].text.strip()
        cleaned = raw.lstrip("```json\n").rstrip("```").strip()
        return json.loads(cleaned)
    except Exception:
        return {"category": "technical", "confidence": "low", "reasoning": "Classification failed"}


async def main():
    tickets = [
        "I was charged twice for my subscription last month",
        "The app crashes when I upload files larger than 10MB",
        "I'd love to see dark mode on the dashboard",
        "I can't log in — password reset email isn't arriving",
    ]
    for ticket in tickets:
        print(f'\nTicket: "{ticket}"')
        print("Result:", classify_ticket(ticket))


asyncio.run(main())

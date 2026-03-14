import anthropic
import json

client = anthropic.Anthropic()


def search_web(query: str) -> list[dict]:
    """Simulated search results"""
    results = {
        "claude context window": [
            {"url": "https://docs.anthropic.com/claude/context-window", "snippet": "Claude 3.5 Sonnet supports up to 200,000 tokens."},
        ],
        "anthropic pricing": [
            {"url": "https://anthropic.com/pricing", "snippet": "Claude API pricing varies by model."},
        ],
    }
    return results.get(query.lower(), [{"url": "https://anthropic.com", "snippet": "Anthropic is an AI safety company."}])


def research_with_provenance(question: str) -> str:
    """TODO: Research with provenance tracking and source citations"""
    return f'TODO: Research "{question}" with provenance tracking'


print(research_with_provenance("What is Claude's context window size?"))

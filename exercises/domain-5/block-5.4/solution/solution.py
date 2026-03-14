import anthropic
import json

client = anthropic.Anthropic()


def search_web(query: str) -> list[dict]:
    results = {
        "claude context window": [{"url": "https://docs.anthropic.com/claude/context-window", "snippet": "Claude 3.5 Sonnet supports up to 200,000 tokens."}],
        "anthropic pricing": [{"url": "https://anthropic.com/pricing", "snippet": "Claude API pricing varies by model."}],
    }
    return results.get(query.lower(), [{"url": "https://anthropic.com", "snippet": "Anthropic is an AI safety company."}])


SEARCH_TOOL = {
    "name": "web_search",
    "description": "Search the web for current information. Use for all factual claims.",
    "input_schema": {"type": "object", "properties": {"query": {"type": "string"}}, "required": ["query"]},
}

SYSTEM = """You are a research assistant. CRITICAL RULES:
1. For every factual claim, cite source: [Source: URL]
2. Training knowledge must be marked: [Training knowledge — unverified]
3. Never state facts without a citation
4. End with a ## Sources section
5. If not found in search, say "I couldn't find verified information\""""


def research_with_provenance(question: str) -> str:
    messages = [{"role": "user", "content": f"Research with citations: {question}"}]

    for _ in range(3):
        response = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=1024,
            system=SYSTEM,
            tools=[SEARCH_TOOL],
            messages=messages,
        )

        if response.stop_reason == "end_turn":
            return response.content[0].text

        if response.stop_reason == "tool_use":
            messages.append({"role": "assistant", "content": response.content})
            tool_results = []
            for block in response.content:
                if block.type == "tool_use":
                    results = search_web(block.input["query"])
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": json.dumps(results),
                    })
            messages.append({"role": "user", "content": tool_results})

    return "Research incomplete"


print(research_with_provenance("What is Claude's context window size?"))

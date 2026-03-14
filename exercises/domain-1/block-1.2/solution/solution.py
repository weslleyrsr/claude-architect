import anthropic
import asyncio
from dataclasses import dataclass

client = anthropic.Anthropic()


@dataclass
class SubagentResult:
    agent_name: str
    content: str
    success: bool
    error: str | None = None


def call_claude(prompt: str) -> str:
    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=512,
        messages=[{"role": "user", "content": prompt}],
    )
    return response.content[0].text if response.content else ""


async def news_agent(topic: str) -> SubagentResult:
    try:
        content = await asyncio.to_thread(
            call_claude,
            f"You are a news researcher. Provide 3 key recent developments related to: {topic}. Be concise (3 bullet points)."
        )
        return SubagentResult("news", content, True)
    except Exception as e:
        return SubagentResult("news", "", False, str(e))


async def academic_agent(topic: str) -> SubagentResult:
    try:
        content = await asyncio.to_thread(
            call_claude,
            f"You are an academic researcher. Provide foundational concepts for: {topic}. Be concise (3 bullet points)."
        )
        return SubagentResult("academic", content, True)
    except Exception as e:
        return SubagentResult("academic", "", False, str(e))


async def synthesis_agent(topic: str, news_content: str, academic_content: str) -> SubagentResult:
    try:
        content = await asyncio.to_thread(
            call_claude,
            f'Synthesize research about "{topic}" into a brief report:\n\nNews: {news_content}\n\nAcademic: {academic_content}\n\nWrite 2-3 paragraphs.'
        )
        return SubagentResult("synthesis", content, True)
    except Exception as e:
        return SubagentResult("synthesis", "", False, str(e))


class OrchestratorAgent:
    async def research(self, topic: str) -> str:
        print(f"🔍 Researching: {topic}")

        # Fan-out: run in parallel
        results = await asyncio.gather(
            news_agent(topic),
            academic_agent(topic),
            return_exceptions=True,
        )

        news = results[0] if isinstance(results[0], SubagentResult) else SubagentResult("news", "Unavailable", False)
        academic = results[1] if isinstance(results[1], SubagentResult) else SubagentResult("academic", "Unavailable", False)

        if not news.success and not academic.success:
            return f"Research failed: could not retrieve data for {topic}"

        synthesis = await synthesis_agent(topic, news.content, academic.content)
        return synthesis.content if synthesis.success else f"Partial:\nNews: {news.content}\nAcademic: {academic.content}"


async def main():
    orchestrator = OrchestratorAgent()
    result = await orchestrator.research("quantum computing")
    print(result)


asyncio.run(main())

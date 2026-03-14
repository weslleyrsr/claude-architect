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


# TODO: Implement each subagent as a separate async function
async def news_agent(topic: str) -> SubagentResult:
    # TODO: Call Claude with a news-focused prompt
    return SubagentResult("news", "TODO", False)


async def academic_agent(topic: str) -> SubagentResult:
    # TODO: Call Claude with an academic/research-focused prompt
    return SubagentResult("academic", "TODO", False)


async def synthesis_agent(
    topic: str, news_content: str, academic_content: str
) -> SubagentResult:
    # TODO: Call Claude to synthesize results
    return SubagentResult("synthesis", "TODO", False)


class OrchestratorAgent:
    async def research(self, topic: str) -> str:
        print(f"🔍 Researching: {topic}")

        # TODO: Run news_agent and academic_agent in PARALLEL using asyncio.gather
        # Handle failures gracefully

        # TODO: Run synthesis_agent with the results

        # TODO: Return the final synthesized report
        return "TODO: final research report"


async def main():
    orchestrator = OrchestratorAgent()
    result = await orchestrator.research("quantum computing")
    print(result)


asyncio.run(main())

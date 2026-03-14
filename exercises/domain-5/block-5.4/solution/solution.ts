import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic()

function searchWeb(query: string): { url: string; snippet: string }[] {
  const results: Record<string, { url: string; snippet: string }[]> = {
    "claude context window": [
      { url: "https://docs.anthropic.com/claude/context-window", snippet: "Claude 3.5 Sonnet supports up to 200,000 tokens context window." },
    ],
    "anthropic pricing": [
      { url: "https://anthropic.com/pricing", snippet: "Claude API pricing varies by model. Haiku is the most cost-effective option." },
    ],
  }
  return results[query.toLowerCase()] ?? [{ url: "https://anthropic.com", snippet: "Anthropic is an AI safety company." }]
}

const searchTool: Anthropic.Tool = {
  name: "web_search",
  description: "Search the web for current information. Use this for any factual claims to ensure accuracy.",
  input_schema: {
    type: "object" as const,
    properties: {
      query: { type: "string", description: "Search query" },
    },
    required: ["query"],
  },
}

async function researchWithProvenance(question: string): Promise<string> {
  const SYSTEM = `You are a research assistant. CRITICAL RULES:
1. For every factual claim, cite your source using [Source: URL] inline
2. If you use training knowledge (not from search), mark it as [Training knowledge — unverified]
3. Do NOT state facts without one of these citations
4. End your response with a "## Sources" section listing all URLs cited
5. If you can't find something in search results, say "I couldn't find verified information about this"`

  const messages: Anthropic.MessageParam[] = [{
    role: "user",
    content: `Research this question and cite all sources: ${question}`
  }]

  // Run agentic loop for search
  for (let i = 0; i < 3; i++) {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: SYSTEM,
      tools: [searchTool],
      messages,
    })

    if (response.stop_reason === "end_turn") {
      return response.content[0].type === "text" ? response.content[0].text : ""
    }

    if (response.stop_reason === "tool_use") {
      messages.push({ role: "assistant", content: response.content })
      const results: Anthropic.ToolResultBlockParam[] = response.content
        .filter((b): b is Anthropic.ToolUseBlock => b.type === "tool_use")
        .map(toolUse => {
          const searchResults = searchWeb((toolUse.input as { query: string }).query)
          return {
            type: "tool_result" as const,
            tool_use_id: toolUse.id,
            content: JSON.stringify(searchResults),
          }
        })
      messages.push({ role: "user", content: results })
    }
  }

  return "Research incomplete"
}

researchWithProvenance("What is Claude's context window size?")
  .then(console.log).catch(console.error)

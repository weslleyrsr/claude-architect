import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic()
const MAX_ITERATIONS = 5

function readFile(path: string): string {
  return `// Simulated file content for ${path}\nfunction add(a, b) { return a + b }\nfunction divide(a, b) { return a / b }  // BUG: no zero check`
}

function analyzeCode(code: string): string {
  if (code.includes("divide") && !code.includes("b === 0")) {
    return "Issue found: divide() has no zero-division guard. Add: if (b === 0) throw new Error('Division by zero')"
  }
  return "No issues found — code looks clean"
}

function processTool(name: string, input: Record<string, string>): string {
  switch (name) {
    case "read_file": return readFile(input.path)
    case "analyze_code": return analyzeCode(input.code)
    default: return `Unknown tool: ${name}`
  }
}

async function runCodeReviewAgent(filePath: string): Promise<string> {
  const tools: Anthropic.Tool[] = [
    {
      name: "read_file",
      description: "Read the contents of a file",
      input_schema: { type: "object" as const, properties: { path: { type: "string" } }, required: ["path"] },
    },
    {
      name: "analyze_code",
      description: "Analyze code for issues",
      input_schema: { type: "object" as const, properties: { code: { type: "string" } }, required: ["code"] },
    },
  ]

  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: `Review the code in ${filePath} for issues. Use read_file first, then analyze_code.` },
  ]

  let iterations = 0
  let finalResponse = ""

  while (iterations < MAX_ITERATIONS) {
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      tools,
      messages,
    })

    iterations++

    if (response.stop_reason === "end_turn") {
      // Extract final text
      const textBlock = response.content.find((b) => b.type === "text")
      finalResponse = textBlock?.type === "text" ? textBlock.text : "No response"
      break
    }

    if (response.stop_reason === "tool_use") {
      // Add assistant message
      messages.push({ role: "assistant", content: response.content })

      // Process all tool calls and build tool_result blocks
      const toolResults: Anthropic.ToolResultBlockParam[] = response.content
        .filter((b): b is Anthropic.ToolUseBlock => b.type === "tool_use")
        .map((toolUse) => ({
          type: "tool_result" as const,
          tool_use_id: toolUse.id,
          content: processTool(toolUse.name, toolUse.input as Record<string, string>),
        }))

      messages.push({ role: "user", content: toolResults })
    }
  }

  if (iterations >= MAX_ITERATIONS && !finalResponse) {
    finalResponse = "Max iterations reached — partial analysis completed"
  }

  return finalResponse
}

runCodeReviewAgent("src/math.ts").then(console.log).catch(console.error)

import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic()
const MAX_ITERATIONS = 5

// Simulated tools — in a real agent these would do real work
function readFile(path: string): string {
  return `// Simulated file content for ${path}\nfunction add(a, b) { return a + b }\nfunction divide(a, b) { return a / b }  // BUG: no zero check`
}

function analyzeCode(code: string): string {
  if (code.includes("divide") && !code.includes("b === 0")) {
    return "Issue found: divide() has no zero-division guard"
  }
  return "No issues found"
}

// TODO: Implement the agentic loop
async function runCodeReviewAgent(filePath: string): Promise<string> {
  const tools: Anthropic.Tool[] = [
    {
      name: "read_file",
      description: "Read the contents of a file",
      input_schema: {
        type: "object" as const,
        properties: { path: { type: "string" } },
        required: ["path"],
      },
    },
    {
      name: "analyze_code",
      description: "Analyze code for issues",
      input_schema: {
        type: "object" as const,
        properties: { code: { type: "string" } },
        required: ["code"],
      },
    },
  ]

  const messages: Anthropic.MessageParam[] = [
    {
      role: "user",
      content: `Review the code in ${filePath} for issues. Use read_file first, then analyze_code.`,
    },
  ]

  // TODO: Implement the loop here
  // 1. Call claude.messages.create with tools and messages
  // 2. Check stop_reason
  // 3. If "tool_use": process tool calls, add results to messages, continue
  // 4. If "end_turn": done
  // 5. Guard with MAX_ITERATIONS

  return "TODO: return the agent's final analysis"
}

// Run it
runCodeReviewAgent("src/math.ts").then(console.log).catch(console.error)

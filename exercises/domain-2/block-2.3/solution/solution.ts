import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js"

const server = new Server(
  { name: "timestamp-calculator", version: "1.0.0" },
  { capabilities: { tools: {} } }
)

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "get_timestamp",
      description: "Get the current UTC timestamp in ISO 8601 format",
      inputSchema: { type: "object", properties: {}, required: [] },
    },
    {
      name: "calculate",
      description: "Safely evaluate a simple math expression. Supports +, -, *, /, parentheses, and numbers only.",
      inputSchema: {
        type: "object",
        properties: {
          expression: {
            type: "string",
            description: "Math expression to evaluate, e.g. '(2 + 3) * 4'",
          },
        },
        required: ["expression"],
      },
    },
  ],
}))

function safeCalculate(expression: string): number {
  // Whitelist: only digits, operators, parens, spaces, dots
  if (!/^[0-9+\-*/().\s]+$/.test(expression)) {
    throw new Error("Invalid expression: only numbers and basic operators allowed")
  }
  // Safe eval via Function (restricted to math only)
  return Function(`"use strict"; return (${expression})`)() as number
}

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params

  if (name === "get_timestamp") {
    return {
      content: [{ type: "text", text: new Date().toISOString() }],
    }
  }

  if (name === "calculate") {
    try {
      const result = safeCalculate(String(args?.expression ?? ""))
      return {
        content: [{ type: "text", text: String(result) }],
      }
    } catch (err) {
      return {
        content: [{ type: "text", text: `Error: ${err}` }],
        isError: true,
      }
    }
  }

  throw new Error(`Unknown tool: ${name}`)
})

async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error("MCP server running on stdio")
}

main().catch(console.error)

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

// TODO: Handle ListToolsRequest — return get_timestamp and calculate tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    // TODO: Define get_timestamp tool (no inputs)
    // TODO: Define calculate tool (expression: string input)
  ],
}))

// TODO: Handle CallToolRequest
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params

  if (name === "get_timestamp") {
    // TODO: Return current ISO timestamp
    return { content: [{ type: "text", text: "TODO" }] }
  }

  if (name === "calculate") {
    // TODO: Safely evaluate math expression (whitelist chars only)
    return { content: [{ type: "text", text: "TODO" }] }
  }

  throw new Error(`Unknown tool: ${name}`)
})

async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error("MCP server running")
}

main().catch(console.error)

---
block: "2.3"
title: MCP Integration & Built-in Tools
domain: "2 — Tool Integration & Design"
task-statements: ["2.4", "2.5"]
exam-weight: "18% (Domain 2 total)"
estimated-time: "~25 min"
---

# Block 2.3 — MCP Integration & Built-in Tools

## Why This Matters for the Exam

Task statements 2.4 and 2.5 test your understanding of the Model Context Protocol (MCP) — what it is, how to integrate MCP servers, and how to use Claude Code's built-in tools. The exam distinguishes between custom tool definitions (inline) and MCP servers (external processes).

## Core Concepts

### What Is MCP?

The **Model Context Protocol** is an open standard for connecting AI assistants to external tools and data sources. Instead of defining tools inline in your API calls, you run a separate MCP server that Claude discovers and uses.

```
Without MCP:
  Your App → Claude API (with tool definitions inline)

With MCP:
  Your App → Claude API
  Claude ←→ MCP Server (separate process)
             └── provides tools dynamically
```

### MCP Server Types

| Transport | Use Case |
|-----------|----------|
| stdio | Local tools, CLI integration (most common) |
| SSE | Web-based, server-sent events |
| HTTP | REST-style, stateless |

**stdio transport** is used in Claude Code (local MCP servers like the one in this repo).

### Configuring MCP in Claude Code

MCP servers are registered in `.mcp.json` at the project root:

```json
{
  "mcpServers": {
    "my-server": {
      "type": "stdio",
      "command": "node",
      "args": ["dist/index.js"],
      "env": {
        "API_KEY": "${API_KEY}"
      }
    }
  }
}
```

Claude Code auto-discovers this file and connects to registered servers.

### Building an MCP Server (TypeScript)

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js"

const server = new Server(
  { name: "my-server", version: "1.0.0" },
  { capabilities: { tools: {} } }
)

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [{
    name: "my_tool",
    description: "Does something useful",
    inputSchema: { type: "object", properties: { input: { type: "string" } }, required: ["input"] }
  }]
}))

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args } = req.params
  if (name === "my_tool") {
    return { content: [{ type: "text", text: `Result: ${args.input}` }] }
  }
  throw new Error(`Unknown tool: ${name}`)
})

const transport = new StdioServerTransport()
await server.connect(transport)
```

### Claude Code Built-in Tools

Claude Code provides built-in tools that don't need MCP:
- **Read** — read file contents
- **Write** — write files
- **Edit** — precise string replacement in files
- **Bash** — execute shell commands
- **Glob** — find files by pattern
- **Grep** — search file contents
- **Agent** — dispatch sub-agents
- **WebSearch** / **WebFetch** — internet access

These are always available in Claude Code sessions and are referenced in CLAUDE.md and skills.

### MCP vs. Inline Tool Definitions

| Aspect | Inline Tools | MCP Server |
|--------|-------------|------------|
| Setup | No server needed | Requires running process |
| Reusability | Per-API-call | Any client can connect |
| State | Stateless | Can maintain state |
| Discovery | Static | Dynamic (server reports capabilities) |
| Best for | Simple, app-specific tools | Shared infrastructure, complex tools |

## Key Patterns & Anti-Patterns

### ✅ Patterns
- Use MCP for tools shared across multiple Claude applications
- Use stdio transport for local development
- Include `env` vars in `.mcp.json` using `${VAR}` syntax (not hardcoded secrets)
- Test MCP servers standalone before integrating

### ❌ Anti-Patterns
- Hardcoding API keys in `.mcp.json` (use env var expansion)
- Building an MCP server for a single-use, app-specific tool
- Not handling `ListToolsRequest` — server must always respond to tool discovery
- Forgetting to handle unknown tool names (throw on unknown)

## Exam Tips

🎯 Know the difference between inline tool definitions and MCP servers — the exam may ask which to use for a given scenario.

🎯 `.mcp.json` is at the project root, not in `.claude/` — it's project-scoped, not user-scoped.

🎯 MCP server must handle both `ListToolsRequest` and `CallToolRequest` — forgetting either breaks the integration.

## Quick Reference
- MCP = external process Claude talks to for tools
- `.mcp.json` at project root — registers servers
- stdio transport = local process (most common)
- MCP server must handle: ListTools + CallTool
- Use `${ENV_VAR}` in .mcp.json (never hardcode secrets)
- Built-in Claude Code tools: Read, Write, Edit, Bash, Glob, Grep, Agent, WebSearch

## Further Reading
- [Model Context Protocol docs](https://modelcontextprotocol.io/introduction)
- [Claude Code MCP integration](https://docs.anthropic.com/en/docs/claude-code/mcp)

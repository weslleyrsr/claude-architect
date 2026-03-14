# Exercise 2.3 — Build a Minimal MCP Server

## Scenario

You need to expose a `get_timestamp` tool and a `calculate` tool to Claude via MCP. Build a minimal stdio MCP server that provides both tools.

## Your Task

Create a complete, runnable MCP server (TypeScript or Python) that:

1. Uses stdio transport
2. Provides a `get_timestamp` tool (returns current ISO timestamp, no inputs)
3. Provides a `calculate` tool (takes `expression: string`, returns evaluated result)
4. Handles `ListTools` and `CallTool` requests
5. Throws an error for unknown tool names

The calculate tool should be safe — only allow simple math (no eval of arbitrary code).

## Success Criteria (used by validator)

- [ ] Server uses stdio transport
- [ ] Both tools are listed in ListTools response
- [ ] `get_timestamp` returns ISO format timestamp
- [ ] `calculate` parses and evaluates simple math expressions safely
- [ ] Unknown tool names return an error (not silent failure)
- [ ] Server entry point is runnable (`node dist/index.js` or `python server.py`)

## Starter Code

See `starter.ts` / `starter.py` in this directory.

## Hints

<details>
<summary>Hint 1 — MCP SDK</summary>
Use `@modelcontextprotocol/sdk` for TypeScript. Import Server, StdioServerTransport, ListToolsRequestSchema, CallToolRequestSchema.
</details>

<details>
<summary>Hint 2 — Safe calculate</summary>
Use a library like `mathjs` or implement a simple parser. For the exercise, you can use a whitelist regex: only allow digits, operators (+,-,*,/), parentheses, and spaces.
</details>

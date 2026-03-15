import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js"

import { gitCreateBranch, gitCommitProgress, gitPushBranch } from "./tools/git.js"
import { progressRead, progressWrite } from "./tools/progress.js"

const server = new Server(
  { name: "claude-architect-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
)

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "git_create_branch",
      description: "Create a new student git branch",
      inputSchema: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: 'Branch name, e.g. "student/alice-1710000000"',
          },
        },
        required: ["name"],
      },
    },
    {
      name: "git_commit_progress",
      description: "Stage the progress/ directory and commit it",
      inputSchema: {
        type: "object",
        properties: {
          message: {
            type: "string",
            description: 'Commit message, e.g. "complete block 1.3 - alice"',
          },
        },
        required: ["message"],
      },
    },
    {
      name: "git_push_branch",
      description: "Push the current student branch to origin",
      inputSchema: {
        type: "object",
        properties: {},
        required: [],
      },
    },
    {
      name: "progress_read",
      description: "Read the student's progress from progress/student.json",
      inputSchema: {
        type: "object",
        properties: {},
        required: [],
      },
    },
    {
      name: "progress_write",
      description:
        "Write (merge) data into progress/student.json. Merges blocks deeply.",
      inputSchema: {
        type: "object",
        properties: {
          data: {
            type: "object",
            description: "Partial StudentProgress to merge",
          },
        },
        required: ["data"],
      },
    },
  ],
}))

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params

  switch (name) {
    case "git_create_branch": {
      const result = gitCreateBranch(args as { name: string })
      return { content: [{ type: "text", text: JSON.stringify(result) }] }
    }

    case "git_commit_progress": {
      const result = gitCommitProgress(args as { message: string })
      return { content: [{ type: "text", text: JSON.stringify(result) }] }
    }

    case "git_push_branch": {
      const result = gitPushBranch()
      return { content: [{ type: "text", text: JSON.stringify(result) }] }
    }

    case "progress_read": {
      const result = progressRead()
      return { content: [{ type: "text", text: JSON.stringify(result) }] }
    }

    case "progress_write": {
      const result = progressWrite(args as { data: object })
      return { content: [{ type: "text", text: JSON.stringify(result) }] }
    }

    default:
      throw new Error(`Unknown tool: ${name}`)
  }
})

async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error("Claude Architect MCP server running on stdio")
}

main().catch(console.error)

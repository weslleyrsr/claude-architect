---
block: "2.2"
title: Error Handling & Tool Distribution
domain: "2 — Tool Integration & Design"
task-statements: ["2.2", "2.3"]
exam-weight: "18% (Domain 2 total)"
estimated-time: "~25 min"
---

# Block 2.2 — Error Handling & Tool Distribution

## Why This Matters for the Exam

Task statements 2.2 and 2.3 test how you handle tool failures gracefully and how you decide which tools to give which agents. These are practical design skills — the exam may present a scenario and ask which error handling approach is correct, or whether an agent has too many or too few tools.

## Core Concepts

### Tool Error Handling Patterns

When a tool fails, you have three choices:

**1. Return an error message (recommended for recoverable errors)**
Instead of throwing, return a structured error that Claude can reason about:

```typescript
// ❌ Throw — Claude sees "tool_error" and may not recover well
throw new Error("File not found")

// ✅ Return error as content — Claude can retry or explain
return { success: false, error: "File not found at path: /data/report.csv", suggestion: "Check if the file exists with list_files first" }
```

**2. Retry with backoff (for transient errors)**
Network calls and rate limits are transient — retry them automatically:

```typescript
async function callWithRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn()
    } catch (err) {
      if (attempt === maxRetries - 1) throw err
      await sleep(1000 * Math.pow(2, attempt))  // exponential backoff
    }
  }
  throw new Error("Unreachable")
}
```

**3. Fail hard (for unrecoverable errors)**
Some errors should stop everything: permissions violations, invalid API keys, data corruption.

### Error Response Schema

Tools should return consistent error structures so Claude can act on them:

```typescript
interface ToolResult<T> {
  success: boolean
  data?: T
  error?: string
  retryable?: boolean
  suggestion?: string
}
```

When `retryable: true`, Claude knows it can try again. When `suggestion` is present, Claude can follow the hint.

### Tool Distribution Across Agents

Not every agent should have every tool. Principle of **least privilege**:

```
Orchestrator:
  - spawn_subagent
  - aggregate_results
  - report_status

Research Subagent:
  - web_search
  - read_document
  (NOT: write_file, execute_code)

Code Subagent:
  - read_file
  - write_file
  - run_tests
  (NOT: web_search, database_access)
```

Give each agent only the tools it needs for its specific role. Benefits:
- Smaller context (tool definitions consume tokens)
- Reduced attack surface (a compromised subagent has limited blast radius)
- Clearer reasoning (fewer choices = fewer mistakes)

### Tool Timeouts

Long-running tools need timeouts to prevent the agentic loop from hanging:

```typescript
async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`Tool timed out after ${ms}ms`)), ms)
  )
  return Promise.race([promise, timeout])
}
```

## Key Patterns & Anti-Patterns

### ✅ Patterns
- Return structured errors (not throws) for recoverable failures
- Include `suggestion` in error responses
- Use exponential backoff for transient failures
- Give each agent the minimum tools it needs

### ❌ Anti-Patterns
- Throwing errors from tools (loses context for Claude)
- Giving all tools to all agents
- No retry logic for network calls
- Silent failures (returning success=true when it failed)

## Exam Tips

🎯 The exam may ask: "A tool returns an error — what should Claude do?" If the error is retryable and the tool says so, retry. If it's unrecoverable, stop and explain.

🎯 "Least privilege" for tools is an exam theme — know that subagents should have fewer tools than orchestrators.

🎯 Silent failures (returning OK when something failed) are always wrong.

## Quick Reference
- Recoverable errors: return structured error, not throw
- Transient errors: retry with exponential backoff
- Unrecoverable errors: fail hard with clear message
- Each agent gets only the tools it needs (least privilege)
- Always include `suggestion` in error responses
- Timeouts prevent loops from hanging indefinitely

## Further Reading
- [Anthropic docs: Error handling in tool use](https://docs.anthropic.com/en/docs/build-with-claude/tool-use/implement-tool-use#handle-tool-use-and-tool-results)

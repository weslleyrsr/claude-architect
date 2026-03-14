---
block: "1.1"
title: Agentic Loops
domain: "1 — Agentic Systems & Orchestration"
task-statements: ["1.1"]
exam-weight: "27% (Domain 1 total)"
estimated-time: "~25 min"
---

# Block 1.1 — Agentic Loops

## Why This Matters for the Exam

Domain 1 is the highest-weighted domain at 27%. The exam tests whether you understand how Claude operates autonomously in a loop — not just as a one-shot completion engine. You must understand what constitutes an agentic loop, how tools fit into the loop, and critically, **when the loop should stop vs. continue**.

Common exam trap: confusing "agentic" with "multi-turn chat." Agentic means Claude is taking actions with real-world side effects in a loop. A chatbot is not agentic.

## Core Concepts

### What Is an Agentic Loop?

An agentic loop is the cycle where Claude:
1. Receives a task (and context)
2. Thinks (reasons about what to do next)
3. Acts (calls a tool or produces output)
4. Observes (gets tool results back)
5. Repeats until the task is complete or a stop condition is met

```
┌─────────────────────────────────────────────┐
│              AGENTIC LOOP                    │
│                                             │
│  Task ──► Reason ──► Act ──► Observe        │
│              ▲                   │          │
│              └───────────────────┘          │
│                                             │
│  Stop when:                                 │
│  • Task complete                            │
│  • Max iterations reached                   │
│  • Human approval required                  │
│  • Unrecoverable error                      │
└─────────────────────────────────────────────┘
```

### Tools as the Action Mechanism

Every "action" in an agentic loop is a tool call. Claude cannot interact with the real world except through tools. Tools can:
- Read/write files
- Execute code
- Call APIs
- Search the web
- Spawn sub-agents

**Key insight:** The loop continues until Claude generates a final text response (no tool call). That's the signal that the task is done.

### The Decide-Act-Observe Cycle

Each iteration of the loop involves:
1. **Decide:** Given current context + tool results, what's the next action?
2. **Act:** Call the chosen tool with appropriate parameters
3. **Observe:** Receive the result, update internal state (via context window)

This is fundamentally different from a single LLM call. The model's context grows with each tool result.

### Stop Conditions

Claude stops looping when:
1. **Task complete** — Claude generates a final response with no tool call
2. **Max iterations** — Orchestrator enforces a limit (prevent runaway loops)
3. **Human checkpoint** — Design requires human approval before proceeding
4. **Error threshold** — Too many failures in a row signal something is wrong
5. **Token budget** — Context window approaching limit

## Key Patterns & Anti-Patterns

### ✅ Patterns

**Bounded loops:** Always set a max_iterations limit. Unbounded loops can run forever and cost money.

```typescript
const MAX_ITERATIONS = 10
let iterations = 0

while (iterations < MAX_ITERATIONS) {
  const response = await claude.messages.create(...)
  if (response.stop_reason === "end_turn") break  // no tool call = done
  // process tool calls...
  iterations++
}
```

**Observe before acting:** Never assume a tool succeeded. Always read the result.

### ❌ Anti-Patterns

**Ignoring stop_reason:** Always check `stop_reason`. `"tool_use"` means continue; `"end_turn"` means done; `"max_tokens"` means the context is full.

**Mutating state on every iteration:** Be careful about tools that write to files or databases. If the loop retries, you may write duplicate data.

## Exam Tips

🎯 The exam may show you an agentic loop implementation and ask what happens when `stop_reason === "max_tokens"`. Answer: the loop should stop and handle the truncation gracefully — not just continue.

🎯 "Agentic" specifically implies autonomous action with side effects. Don't confuse with multi-turn conversation.

🎯 Know the difference between the **orchestrator** (manages the loop, decides when to stop) and the **agent** (Claude executing within the loop).

## Quick Reference

- Agentic loop = reason → act → observe cycle
- `stop_reason === "end_turn"` = task complete, exit loop
- `stop_reason === "tool_use"` = process tool calls, continue loop
- `stop_reason === "max_tokens"` = context full, handle gracefully
- Always bound loops with a max_iterations guard
- Claude can only affect the world through tool calls

## Further Reading

- [Anthropic docs: Tool use](https://docs.anthropic.com/en/docs/build-with-claude/tool-use)
- [Anthropic docs: Agentic and tool use overview](https://docs.anthropic.com/en/docs/build-with-claude/tool-use/overview)

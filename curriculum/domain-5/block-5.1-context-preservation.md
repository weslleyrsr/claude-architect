---
block: "5.1"
title: Context Preservation
domain: "5 — Production Operations & Safety"
task-statements: ["5.1"]
exam-weight: "15% (Domain 5 total)"
estimated-time: "~20 min"
---

# Block 5.1 — Context Preservation

## Why This Matters for the Exam

Task statement 5.1 tests how you manage context in long-running agentic sessions. The exam focuses on strategies for preserving important information when context windows fill up, and the trade-offs between different approaches.

## Core Concepts

### The Context Window Problem

Every Claude API call has a finite context window. For long agentic tasks:
- Each tool result appended to messages grows the context
- Earlier context gets "pushed out" when window fills
- Important decisions made early can be forgotten by later iterations

```
┌─────────────────────────────────────────────┐
│  CONTEXT WINDOW (200k tokens)               │
│                                             │
│  [System prompt]           ~1k tokens       │
│  [Turn 1 user+assistant]   ~2k tokens       │
│  [Tool results 1-5]        ~10k tokens      │
│  [Turn 5 user+assistant]   ~5k tokens       │
│  [Tool results 6-20]       ~40k tokens      │
│  ... continues growing ...                  │
│                                             │
│  When full → oldest content truncated ──────┤
│                         (INFORMATION LOST)  │
└─────────────────────────────────────────────┘
```

### Strategy 1: Selective Retention

Not all context is equally valuable. Summarize or discard low-value content:

```typescript
// Instead of keeping full tool results, keep just the key finding
const toolResult = await fetchPageTool(url)
const keySummary = await summarize(toolResult, "Extract only the key data points")
messages.push({ role: "user", content: `[Summarized result from ${url}]: ${keySummary}` })
```

### Strategy 2: External Memory

Move important information out of the context window and into external storage:

```typescript
interface AgentMemory {
  decisions: Decision[]        // stored in DB
  completedSteps: string[]     // stored in file
  keyFindings: Finding[]       // stored in vector store
}

// When context gets full, persist and prune
if (estimateTokens(messages) > CONTEXT_THRESHOLD) {
  await saveToExternal(extractImportant(messages))
  messages = pruneOldContext(messages)
  messages.unshift(await buildContextSummary())  // inject summary
}
```

### Strategy 3: Context Compaction (Claude Code)

Claude Code provides `/compact` which automatically:
1. Summarizes the conversation so far
2. Replaces detailed history with the summary
3. Preserves the most recent messages intact

This is analogous to what you'd build manually in the API — compress old context, preserve recent.

### Strategy 4: Structured Context Headers

At the top of long sessions, maintain a structured "state of the world" that gets updated rather than grown:

```markdown
## Current State (updated each iteration)
- Task: Refactor auth module
- Status: In progress — 3/7 files done
- Files completed: auth.ts, session.ts, tokens.ts
- Current file: middleware.ts
- Decisions made: switched to JWT (see turn 3)
- Next: update router.ts after middleware.ts

[Historical turns below — can be compacted]
```

This header contains enough context for any turn to be productive.

### Token Estimation

Before context fills, estimate token usage:

```typescript
function estimateTokens(text: string): number {
  // Rough estimate: ~4 chars per token for English
  return Math.ceil(text.length / 4)
}

function shouldCompact(messages: Message[]): boolean {
  const totalChars = messages.reduce((sum, m) => sum + JSON.stringify(m).length, 0)
  return estimateTokens(JSON.stringify(messages)) > 150_000  // compact at 75% of 200k
}
```

## Key Patterns & Anti-Patterns

### ✅ Patterns
- Summarize tool results as they arrive (keep findings, not raw output)
- Maintain a "state of the world" header that gets updated, not grown
- Compact at ~70-75% of context limit (leave room for compaction overhead)
- Use external storage for decisions and completed steps

### ❌ Anti-Patterns
- Appending full API responses to context (10x bloat vs. summary)
- Letting context fill completely before acting (no room to compact)
- Losing key decisions to truncation (save them externally)
- No context monitoring (context fills silently)

## Exam Tips

🎯 The exam may ask what to do when context is 90% full. Answer: compact (summarize) before it's too late — not after.

🎯 Know the four strategies: selective retention, external memory, compaction, structured headers.

🎯 `/compact` in Claude Code does automatic compaction — know that it exists and when to use it.

## Quick Reference
- Context windows are finite — long tasks need active management
- Strategy 1: summarize tool results instead of keeping raw output
- Strategy 2: external memory (DB, file) for decisions and findings
- Strategy 3: compaction (summary replaces history)
- Strategy 4: structured "state of the world" header
- Compact at ~75% full — never wait until 100%

## Further Reading
- [Claude Code /compact command](https://docs.anthropic.com/en/docs/claude-code/memory#managing-context-window)

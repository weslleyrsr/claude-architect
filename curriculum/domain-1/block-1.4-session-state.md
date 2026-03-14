---
block: "1.4"
title: Session State & Management
domain: "1 — Agentic Systems & Orchestration"
task-statements: ["1.7"]
exam-weight: "27% (Domain 1 total)"
estimated-time: "~20 min"
---

# Block 1.4 — Session State & Management

## Why This Matters for the Exam

Task statement 1.7 covers how agents persist and manage state across turns and sessions. The exam tests whether you understand the difference between in-context state (temporary), external state (persistent), and how to design agents that can resume interrupted workflows.

## Core Concepts

### The State Problem in Agentic Systems

Claude has no persistent memory between API calls. Every conversation starts fresh. For long-running agentic tasks, this creates a fundamental challenge: **how do you maintain state across multiple turns or sessions?**

```
Session 1:  Task starts → Progress: 30% → Session ends
                                               │
            State must be saved externally! ──►│
                                               │
Session 2:  Load state → Resume from 30% ─────┘
```

### Three Tiers of State

**Tier 1: In-context state (temporary)**
State stored in the conversation messages array. Lost when session ends.
- Best for: within-session working memory, intermediate results
- Limitation: grows with every turn, consumes context window

**Tier 2: External state (persistent)**
State stored outside Claude — in files, databases, or KV stores.
- Best for: progress tracking, user preferences, completed results
- This repo uses: `progress/student.json` + git commits

**Tier 3: Structural state (in git)**
Using git commits as state checkpoints. Each commit = a durable state snapshot.
- Best for: code changes, documents, traceable progress
- This repo uses: student branches with one commit per completed block

### Designing Resumable Workflows

A resumable workflow:
1. Saves progress at each checkpoint (external state)
2. On startup, reads saved state to determine where to resume
3. Idempotently re-runs any incomplete steps (safe to replay)

```typescript
async function resumableWorkflow(taskId: string) {
  // Load saved state
  const state = await loadState(taskId)
  const completedSteps = state?.completedSteps ?? []

  for (const step of ALL_STEPS) {
    if (completedSteps.includes(step.name)) {
      console.log(`Skipping already-done: ${step.name}`)
      continue  // Resume from where we left off
    }

    await step.execute()
    completedSteps.push(step.name)

    // Save after each step
    await saveState(taskId, { completedSteps })
  }
}
```

### Context Window Management

As sessions grow, context windows fill up. Strategies:
- **Summarization:** Compress earlier turns into a summary
- **Selective retrieval:** Only load relevant context for current step
- **External memory:** Move detailed content to files, reference by ID
- **Compaction:** Claude Code's /compact command does this automatically

## Key Patterns & Anti-Patterns

### ✅ Patterns

**State versioning:** Include a `version` field in saved state. If the workflow schema changes, you can migrate old state.

**Atomic saves:** Write state atomically (write to temp file, then rename) to avoid partial writes.

**State schema validation:** Validate loaded state against a schema before using it. External state can be corrupted.

### ❌ Anti-Patterns

**Storing all state in context:** Over-relying on the conversation history as state. This blows up context windows.

**Non-idempotent steps without checkpointing:** If step 7 fails after step 6 modified a file, you'll modify the file again on retry.

**Trusting external state blindly:** External state can be modified by other processes or corrupted. Always validate.

## Exam Tips

🎯 The exam may ask how to design an agent that can resume after being interrupted. Key answer: save progress to external storage after each step.

🎯 Know the difference between context window state and persistent state. Context window = temporary. Filesystem/DB = persistent.

🎯 Idempotency is critical for resumable workflows. Steps that are already complete should be skippable.

## Quick Reference

- Claude has no memory between sessions — state must be saved externally
- Three tiers: in-context (temp), external file/DB (persistent), git (structural)
- Resumable = save state at checkpoints + skip completed steps on restart
- Context window grows with every turn — use summarization or external memory for long sessions
- Validate external state before using — don't trust blindly

## Further Reading

- [Anthropic docs: Long context strategies](https://docs.anthropic.com/en/docs/build-with-claude/context-windows)

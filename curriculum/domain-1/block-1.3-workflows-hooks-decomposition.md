---
block: "1.3"
title: Workflows, Hooks & Task Decomposition
domain: "1 — Agentic Systems & Orchestration"
task-statements: ["1.4", "1.5", "1.6"]
exam-weight: "27% (Domain 1 total)"
estimated-time: "~30 min"
---

# Block 1.3 — Workflows, Hooks & Task Decomposition

## Why This Matters for the Exam

Task statements 1.4–1.6 test your ability to design agentic workflows — not just loops, but structured processes with hooks (pre/post steps), branching, and systematic task decomposition. The exam distinguishes between ad-hoc loops and intentional workflow design.

## Core Concepts

### Agentic Workflows vs. Simple Loops

A **workflow** is a structured sequence with defined phases, decision points, and hooks. It's more intentional than a loop.

```
┌─────────────────────────────────────────────┐
│              AGENTIC WORKFLOW               │
│                                             │
│  [Pre-flight checks]                        │
│        │                                    │
│        ▼                                    │
│  [Phase 1: Research]                        │
│        │                                    │
│        ▼                                    │
│  [Hook: validate research quality]          │
│        │                                    │
│        ├─ pass ──► [Phase 2: Draft]        │
│        └─ fail ──► [Re-research]           │
│                                             │
│  [Phase 2: Draft]                           │
│        │                                    │
│        ▼                                    │
│  [Hook: human review checkpoint]            │
│        │                                    │
│        ▼                                    │
│  [Phase 3: Finalize]                        │
└─────────────────────────────────────────────┘
```

### Hooks in Agentic Systems

Hooks are **event-driven callbacks** that fire at specific points in a workflow:

**Pre-action hooks:** Run before an action executes
- Validate inputs
- Check permissions
- Log the pending action
- Block dangerous operations

**Post-action hooks:** Run after an action completes
- Validate outputs
- Update state
- Trigger notifications
- Commit progress

In Claude Code specifically, hooks are registered in `.claude/settings.json` and fire on events like `PreToolUse`, `PostToolUse`, `SessionStart`, `Stop`.

### Task Decomposition Strategies

**Strategy 1: Hierarchical decomposition**
Break a large task into domains → subdomains → atomic tasks

```
"Build a web scraper"
├── Design schema
│   ├── Define output fields
│   └── Choose storage format
├── Implement scraper
│   ├── HTTP fetching
│   ├── HTML parsing
│   └── Data extraction
└── Test & validate
    ├── Unit tests
    └── Integration test
```

**Strategy 2: Dependency ordering**
Identify which tasks must complete before others can start. Parallelize independent tasks.

**Strategy 3: Checkpoint decomposition**
Break at natural human review points. Anything before a checkpoint is autonomous; anything after requires approval.

### Human-in-the-Loop Checkpoints

Not every workflow should be fully autonomous. Design checkpoints where:
- Irreversible actions require human approval
- Quality gates need human judgment
- Scope expands beyond the original task

```typescript
async function runWithCheckpoint(task: string) {
  const plan = await agent.planTask(task)

  // Checkpoint: review the plan before executing
  const approved = await promptHuman(`Approve this plan?\n${plan}`)
  if (!approved) return "Task cancelled"

  return await agent.executePlan(plan)
}
```

## Key Patterns & Anti-Patterns

### ✅ Patterns

**Pre-flight validation:** Before starting a workflow, validate that all required resources/permissions exist. Fail fast rather than discovering problems mid-execution.

**Idempotent steps:** Design workflow steps to be safe to retry. If a step fails and retries, it shouldn't cause duplicate side effects.

**Progress checkpoints:** Commit progress at natural breakpoints. If the workflow dies, it can resume from the last checkpoint.

### ❌ Anti-Patterns

**Monolithic workflows:** One giant task with no decomposition makes debugging impossible and context windows explode.

**Missing rollback:** Long workflows that can't undo partial work if they fail halfway.

**Autonomous irreversible actions:** Deleting data, sending emails, or charging credit cards without a human checkpoint.

## Exam Tips

🎯 Know the difference between Pre-tool hooks (can block) and Post-tool hooks (can't block, can alert).

🎯 Task decomposition is tested: the exam may ask you to identify the right decomposition strategy for a given scenario.

🎯 "Checkpoint" is a key pattern — know when to pause for human approval vs. proceed autonomously.

## Quick Reference

- Workflow = structured loop with phases, hooks, and decision points
- Pre-action hook = runs before, can block
- Post-action hook = runs after, cannot block
- Decompose tasks: hierarchical, dependency-ordered, or checkpoint-based
- Always checkpoint before irreversible actions
- Design steps to be idempotent (safe to retry)

## Further Reading

- [Claude Code hooks documentation](https://docs.anthropic.com/en/docs/claude-code/hooks)

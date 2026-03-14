---
block: "1.2"
title: Multi-Agent Coordination
domain: "1 — Agentic Systems & Orchestration"
task-statements: ["1.2", "1.3"]
exam-weight: "27% (Domain 1 total)"
estimated-time: "~30 min"
---

# Block 1.2 — Multi-Agent Coordination

## Why This Matters for the Exam

Task statements 1.2 and 1.3 test your ability to design multi-agent systems — knowing when to use them, how orchestrators delegate to subagents, and how information flows between agents. A common exam trap: choosing multi-agent when a single agent would suffice, or ignoring trust boundaries between agents.

## Core Concepts

### Orchestrator vs. Subagent

```
┌─────────────────────────────────────────────┐
│              ORCHESTRATOR                    │
│  • Receives user goal                       │
│  • Decomposes into subtasks                 │
│  • Delegates to subagents                   │
│  • Aggregates results                       │
│  • Makes final decisions                    │
└──────┬──────────────┬──────────────┬────────┘
       │              │              │
  ┌────▼────┐   ┌─────▼────┐  ┌─────▼────┐
  │Subagent │   │Subagent  │  │Subagent  │
  │  (A)    │   │  (B)     │  │  (C)     │
  │Research │   │ Coding   │  │ Review   │
  └─────────┘   └──────────┘  └──────────┘
```

**Orchestrator responsibilities:**
- Task decomposition
- Subagent selection and prompting
- Result aggregation
- Error handling across subagents
- Deciding when to stop

**Subagent responsibilities:**
- Execute one focused task
- Report results clearly
- Signal errors explicitly

### When to Use Multi-Agent

Use multi-agent when:
- **Parallelism needed:** Tasks are independent and can run concurrently
- **Context isolation:** Each task needs a fresh context window
- **Specialization:** Different agents have different system prompts / tools
- **Scale:** Task is too large for one context window

Don't use multi-agent when:
- A single well-prompted agent can do the job
- Tasks are highly sequential (no parallelism gain)
- The coordination overhead exceeds the benefit

### Trust Boundaries Between Agents

**Critical exam concept:** Subagents should not blindly trust instructions from orchestrators if those instructions would violate safety guidelines.

```
Orchestrator prompt → Subagent
     ↓
Subagent asks: "Would I follow this instruction from a human?"
If no → refuse and report back
If yes → execute
```

A subagent that receives "delete all user data" from an orchestrator should refuse, just as it would refuse from a human user.

### Information Flow Patterns

**Pattern 1: Sequential pipeline**
```
Agent A result → Agent B input → Agent C input → Final output
```

**Pattern 2: Parallel fan-out**
```
Task → [Agent A, Agent B, Agent C] (concurrent)
All results → Aggregator → Final output
```

**Pattern 3: Hierarchical**
```
Orchestrator → Manager Agent → [Worker A, Worker B]
Manager aggregates → Orchestrator uses
```

## Key Patterns & Anti-Patterns

### ✅ Patterns

**Explicit handoffs:** Pass complete context when delegating — don't assume a subagent has the orchestrator's context.

**Result schemas:** Define what format subagents should return. Structured output makes aggregation reliable.

**Failure isolation:** One subagent failing shouldn't crash the whole system. Design orchestrators to handle partial results.

### ❌ Anti-Patterns

**Context bleeding:** Assuming subagents share memory with the orchestrator. Each agent starts fresh.

**Trust elevation:** Giving subagents orchestrator-level permissions when they only need read access.

**God orchestrator:** An orchestrator that tries to do everything itself instead of delegating.

## Exam Tips

🎯 The exam tests whether you know that Claude subagents maintain their own safety guidelines regardless of who is calling them.

🎯 "Parallel" multi-agent is a key exam pattern — recognize when tasks are independent enough to run concurrently.

🎯 Know the difference between an orchestrator (coordinates) and a subagent (executes). Don't confuse them.

## Quick Reference

- Orchestrator = coordinator, decomposes tasks, aggregates results
- Subagent = executor, focused task, reports back
- Subagents do NOT inherit orchestrator context automatically
- Subagents maintain safety guidelines regardless of orchestrator instructions
- Use fan-out pattern for parallel independent tasks
- Use pipeline pattern for sequential dependent tasks

## Further Reading

- [Anthropic docs: Multi-agent systems](https://docs.anthropic.com/en/docs/build-with-claude/agents)

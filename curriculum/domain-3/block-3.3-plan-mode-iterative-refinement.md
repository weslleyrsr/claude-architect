---
block: "3.3"
title: Plan Mode & Iterative Refinement
domain: "3 — Claude Code Configuration & Customization"
task-statements: ["3.4", "3.5"]
exam-weight: "20% (Domain 3 total)"
estimated-time: "~20 min"
---

# Block 3.3 — Plan Mode & Iterative Refinement

## Why This Matters for the Exam

Task statements 3.4 and 3.5 test your understanding of Claude Code's Plan Mode — when to use it, how iterative refinement works, and how to structure complex tasks for effective AI collaboration. The exam may present a scenario and ask whether Plan Mode is appropriate.

## Core Concepts

### What Is Plan Mode?

Plan Mode is a Claude Code feature where Claude **thinks and plans without taking action**. Instead of immediately writing code or running commands, Claude:
1. Analyzes the task
2. Proposes a plan
3. Waits for human approval
4. Only then executes

This is the "measure twice, cut once" principle applied to AI development.

```
Without Plan Mode:
  User: "Refactor the auth module"
  Claude: [immediately starts editing files] ← risky for large changes

With Plan Mode:
  User: "Refactor the auth module"
  Claude: "Here's my plan:
    1. Read all files in auth/
    2. Identify the key changes needed
    3. Update auth.ts first (core logic)
    4. Update tests
    5. Update type definitions
    Shall I proceed?"
  User: "Yes, but skip step 4 for now"
  Claude: [executes approved plan]
```

### When to Use Plan Mode

**Use Plan Mode when:**
- The task involves multiple file changes
- You're not sure of the full scope
- The changes are hard to reverse (database migrations, API changes)
- You want to understand Claude's approach before it acts

**Don't need Plan Mode when:**
- Single-file change
- Small, reversible edit
- You trust Claude's approach for the task

### Iterative Refinement Pattern

Plan Mode enables iterative refinement — the human and Claude negotiate the plan before execution:

```
Round 1: Claude proposes broad plan
Round 2: Human adjusts scope ("skip step 3, add step 2b")
Round 3: Claude refines and confirms
Round 4: Execution begins
```

This is different from "just do it" — it's collaborative design before implementation.

### EnterPlanMode / ExitPlanMode in Skills

Skills can programmatically enter and exit plan mode:

```markdown
# My Skill

Invoke EnterPlanMode to begin planning.

[planning steps here]

When plan is approved, invoke ExitPlanMode to execute.
```

This is how complex skills (like this study system's skills) can safely propose large changes before acting.

### The /compact Command

Related concept: `/compact` compresses the conversation history to free up context window space, while preserving the key decisions and current plan. Use it when sessions get long and context is getting full.

## Key Patterns & Anti-Patterns

### ✅ Patterns
- Enter Plan Mode before multi-file refactors
- Show numbered steps so humans can approve/modify specific steps
- Exit Plan Mode only after explicit human approval
- Use Plan Mode for database migrations, API changes, large refactors

### ❌ Anti-Patterns
- Using Plan Mode for trivial single-line changes (overkill)
- Exiting Plan Mode without waiting for approval
- Plans with no step numbers (hard to modify)
- Combining many risky changes into one plan without checkpoints

## Exam Tips

🎯 Plan Mode = think and plan without acting. The exam may ask when to use it.

🎯 Iterative refinement is the core value — the human can modify the plan between rounds.

🎯 Know that ExitPlanMode should only follow explicit human approval.

## Quick Reference
- Plan Mode = plan first, act after approval
- Use for: multi-file changes, hard-to-reverse ops, unknown scope
- Skip for: single-file, small, reversible changes
- Iterative refinement: negotiate plan before execution
- EnterPlanMode → plan → human approval → ExitPlanMode → execute
- /compact = compress history to free context window

## Further Reading
- [Claude Code plan mode docs](https://docs.anthropic.com/en/docs/claude-code/plan-mode)

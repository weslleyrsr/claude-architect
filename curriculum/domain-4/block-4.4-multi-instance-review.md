---
block: "4.4"
title: Multi-Instance Review Architecture
domain: "4 — Prompt Engineering & Structured Output"
task-statements: ["4.6"]
exam-weight: "20% (Domain 4 total)"
estimated-time: "~20 min"
---

# Block 4.4 — Multi-Instance Review Architecture

## Why This Matters for the Exam

Task statement 4.6 tests your ability to design review systems that use multiple Claude instances to improve quality. This is an advanced prompt engineering pattern — using Claude to review Claude's own output, or using multiple independent reviewers to reach consensus.

## Core Concepts

### Why Multiple Instances?

A single Claude call can produce biased, inconsistent, or incomplete output. Using multiple independent instances:
1. Catches errors one instance misses
2. Provides consensus on ambiguous decisions
3. Separates generation from critique
4. Mimics expert panel reviews

### Pattern 1: Generator + Critic

```
Instance A (Generator):
  Prompt: "Write a detailed plan for X"
  → Produces: plan.md

Instance B (Critic):
  Prompt: "Review this plan for flaws and gaps: [plan.md]"
  → Produces: critique.md

Instance A (Reviser):
  Prompt: "Revise this plan based on the critique: [critique.md]"
  → Produces: improved_plan.md
```

This is powerful because the critic sees the output fresh, without the generator's reasoning path biases.

### Pattern 2: N-Instance Consensus (Voting)

For classification or decision tasks, run N instances independently and take the majority vote:

```typescript
async function consensusClassify(text: string, n = 3): Promise<string> {
  const results = await Promise.all(
    Array.from({ length: n }, () => classifyText(text))
  )

  // Count votes
  const votes = results.reduce((acc, r) => {
    acc[r] = (acc[r] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Return majority
  return Object.entries(votes).sort(([,a], [,b]) => b - a)[0][0]
}
```

Useful when: accuracy matters more than speed, and wrong answers have high cost.

### Pattern 3: Specialized Reviewer Pipeline

Different reviewers check for different things:

```
Draft code
    │
    ├──► Security Reviewer → security issues
    ├──► Performance Reviewer → bottlenecks
    ├──► Style Reviewer → code style
    └──► Test Reviewer → test coverage

All reviews → Aggregator → Final report
```

Each reviewer has a focused system prompt and only looks for its specific concern. This produces more thorough reviews than one "review everything" prompt.

### When to Use Multi-Instance

**Use when:**
- High-stakes decisions (code deployed to production)
- Ambiguous classifications where a single answer may be wrong
- Creative work that benefits from independent critique
- Security reviews (multiple eyes on sensitive code)

**Don't use when:**
- Simple, unambiguous tasks (adds latency/cost for no gain)
- Real-time requirements (N instances = N× latency)
- Budget-constrained pipelines

### Aggregation Strategies

How you combine multiple reviewer outputs matters:
- **Majority vote:** For discrete classifications
- **Union of issues:** For bug/security finding (take all found issues)
- **Intersection of praise:** For quality gates (only pass what all reviewers approve)
- **Weighted average:** When reviewers have different expertise levels

## Key Patterns & Anti-Patterns

### ✅ Patterns
- Generator + Critic pattern for iterative improvement
- Independent instances (don't share reasoning context)
- Specialized reviewers (one focus each)
- Union for security issues (find everything)

### ❌ Anti-Patterns
- Having instances share reasoning (defeats independence)
- Using multi-instance for simple tasks (cost/latency waste)
- Ignoring dissenting reviews (valuable signal)
- Reviewer prompts that are too broad

## Exam Tips

🎯 Generator + Critic is the key multi-instance pattern — know how it works.

🎯 Independence matters — reviewers must not see each other's reasoning, only the output being reviewed.

🎯 For security issues, use UNION (not intersection) — you want to find all issues, not just ones all reviewers agree on.

## Quick Reference
- Multi-instance = multiple Claude calls for same artifact
- Generator + Critic: generate → independent review → revise
- N-instance voting: majority vote for consensus
- Specialized reviewers: one system prompt per concern
- Union for defect finding; intersection for quality gates
- Independence = reviewers don't share reasoning context

## Further Reading
- [Anthropic docs: Multi-agent patterns](https://docs.anthropic.com/en/docs/build-with-claude/agents#how-to-build-effective-agents)

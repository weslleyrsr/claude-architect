---
block: "5.4"
title: Provenance & Uncertainty
domain: "5 — Production Operations & Safety"
task-statements: ["5.6"]
exam-weight: "15% (Domain 5 total)"
estimated-time: "~20 min"
---

# Block 5.4 — Provenance & Uncertainty

## Why This Matters for the Exam

Task statement 5.6 tests your understanding of how to handle uncertainty and track provenance (the origin of information) in agentic systems. The exam focuses on when Claude should express uncertainty, how to track where information came from, and designing systems that don't present AI-generated content as authoritative fact.

## Core Concepts

### What Is Provenance?

Provenance = where did this information come from?

In agentic systems, Claude synthesizes information from multiple sources:
- Tool results (web searches, API calls, file reads)
- Training knowledge (may be outdated)
- User-provided context

Without tracking provenance, it's impossible to:
- Audit decisions later
- Verify claims against sources
- Identify when Claude is confident vs. guessing

### Provenance Tracking Pattern

Track the source of every key claim:

```typescript
interface Claim {
  statement: string
  source: "tool:web_search" | "tool:file_read" | "training_knowledge" | "user_input"
  sourceDetails: string    // e.g., URL, filename, "User said in turn 3"
  confidence: "high" | "medium" | "low"
  verifiable: boolean      // can this be independently verified?
}
```

When Claude makes a decision, it should be traceable to source claims.

### Uncertainty Expression

Claude should explicitly signal uncertainty rather than guessing confidently:

```
✅ Good uncertainty expression:
"Based on the documentation I found (source: docs.anthropic.com, retrieved 2024-01), the token limit is 200k — but this may have changed since then."

❌ Bad (false confidence):
"The token limit is 200k." (stated as fact without source)
```

Force explicit uncertainty with prompting:
```
"When you make any factual claims, include your confidence level (high/medium/low) and cite your source. If you don't know something, say 'I don't know' rather than guessing."
```

### Hallucination Detection Patterns

Common Claude hallucination patterns to watch for:
- Specific numbers/statistics (dates, percentages, prices) not from tool results
- Named people/places/companies not verified by search
- Code APIs or methods that "sound right" but aren't verified
- Legal or medical claims made with false confidence

**Defense:** For high-stakes claims, require Claude to cite a tool result as source:
```typescript
const prompt = `
Answer the question using ONLY information from the provided search results.
If the answer isn't in the search results, say "I couldn't find this in the provided sources."
Never answer from training knowledge for factual questions.
`
```

### The "Known Unknown" Principle

Design systems to distinguish:
- **Known knowns:** Facts with verified sources
- **Known unknowns:** Explicitly flagged gaps in knowledge
- **Unknown unknowns:** Things Claude doesn't know it doesn't know (dangerous!)

Prompting for known unknowns: "Before answering, list any information you'd need that you don't have."

### Audit Trails in Agentic Systems

For production agentic systems, log:
- Every tool call and its result
- Every decision and its basis
- Every time Claude expressed uncertainty vs. confidence
- Every human review that was triggered

This audit trail enables post-mortem analysis when something goes wrong.

## Key Patterns & Anti-Patterns

### ✅ Patterns
- Track provenance (source) for every key claim
- Explicit uncertainty signals ("I'm not certain because...")
- Require tool citations for factual claims
- Build audit logs for all agent decisions

### ❌ Anti-Patterns
- Presenting training knowledge as fact (may be outdated)
- No audit trail for agent decisions
- Using Claude for high-stakes factual claims without source verification
- Trusting confident-sounding Claude output without checking sources

## Exam Tips

🎯 Provenance = tracking where information came from. The exam tests whether you build traceability into agentic systems.

🎯 Known unknowns > unknown unknowns — design prompts that force Claude to flag gaps.

🎯 For high-stakes facts, require tool citations — never trust training knowledge alone.

## Quick Reference
- Provenance = source tracking for every key claim
- Track: tool result, training knowledge, or user input
- Uncertainty: Claude should say "I don't know" not guess
- Hallucination defense: require tool citations for facts
- Known unknowns: explicitly flagged gaps (better than hidden unknowns)
- Audit trail: log every decision and its basis for production systems

## Further Reading
- [Anthropic docs: Reducing hallucinations](https://docs.anthropic.com/en/docs/build-with-claude/reduce-latency#reduce-hallucinations)

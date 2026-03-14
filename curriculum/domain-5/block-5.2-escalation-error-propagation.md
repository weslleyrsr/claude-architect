---
block: "5.2"
title: Escalation & Error Propagation
domain: "5 — Production Operations & Safety"
task-statements: ["5.2", "5.3"]
exam-weight: "15% (Domain 5 total)"
estimated-time: "~25 min"
---

# Block 5.2 — Escalation & Error Propagation

## Why This Matters for the Exam

Task statements 5.2 and 5.3 test how errors propagate through multi-agent systems and when agents should escalate to humans. The exam focuses on distinguishing recoverable from unrecoverable errors, and designing escalation flows.

## Core Concepts

### Error Categories in Agentic Systems

```
RECOVERABLE (handle automatically)        UNRECOVERABLE (escalate)
─────────────────────────────────         ──────────────────────────
• API rate limit (429)          →  retry  • Permissions denied permanently
• Network timeout               →  retry  • Data corruption detected
• Partial tool failure          →  retry  • Safety policy violation
• Temporary service unavail.   →  retry  • Scope exceeds authorization
• Ambiguous user intent         →  clarify • Irreversible action required
```

### Escalation Patterns

**Pattern 1: Error threshold escalation**
After N failures, stop retrying and escalate:

```typescript
let consecutiveFailures = 0
const ESCALATION_THRESHOLD = 3

while (true) {
  try {
    await performStep()
    consecutiveFailures = 0
  } catch (err) {
    consecutiveFailures++
    if (consecutiveFailures >= ESCALATION_THRESHOLD) {
      await escalateToHuman(`Failed ${ESCALATION_THRESHOLD} times: ${err}`)
      break
    }
  }
}
```

**Pattern 2: Confidence-based escalation**
When Claude is unsure, ask rather than guess:

```
If confidence < threshold:
  → Pause
  → Explain what's unclear
  → Ask specific question
  → Wait for human answer
  → Resume with clarification
```

**Pattern 3: Scope escalation**
When the task scope expands beyond the original authorization:

```
User asked: "Fix the login bug"
Claude discovers: "This requires touching 8 files and the auth database schema"
→ Escalate: "The fix is larger than expected. Here's what's needed: [list]. Proceed?"
```

### Error Propagation in Multi-Agent Systems

In multi-agent systems, errors don't always stay local:

```
Orchestrator
    │
    ├── Agent A (fails with unrecoverable error)
    │         │
    │         └──► Should this error propagate up?
    │
    ├── Agent B (succeeds)
    └── Agent C (succeeds)

Decision tree:
- If A's output is required for final result → propagate, orchestrator handles
- If A's output is optional → continue with B and C results, log A's failure
- If A's failure means the whole task is invalid → cancel all, escalate
```

### Designing Escalation Messages

Good escalation messages:
1. State what was attempted
2. Describe the specific error/ambiguity
3. Provide options (if applicable)
4. Ask a specific, answerable question

```
❌ Bad: "Something went wrong, what should I do?"
✅ Good: "The database migration requires dropping the 'users_old' table, which contains 2,400 rows.
          This is irreversible. Should I:
          a) Proceed with the deletion
          b) Export the data first, then delete
          c) Abort the migration"
```

### Graceful Degradation

When a sub-component fails, degrade gracefully rather than crashing:

```typescript
async function generateReport(data: ReportData): Promise<Report> {
  const [summary, charts, forecast] = await Promise.allSettled([
    generateSummary(data),     // required
    generateCharts(data),      // optional
    generateForecast(data),    // optional
  ])

  if (summary.status === "rejected") throw summary.reason  // required — fail

  return {
    summary: summary.value,
    charts: charts.status === "fulfilled" ? charts.value : null,  // optional — degrade
    forecast: forecast.status === "fulfilled" ? forecast.value : null,
    warnings: [
      ...(charts.status === "rejected" ? ["Charts unavailable"] : []),
      ...(forecast.status === "rejected" ? ["Forecast unavailable"] : []),
    ]
  }
}
```

## Key Patterns & Anti-Patterns

### ✅ Patterns
- Classify errors before deciding to retry vs. escalate
- Escalation messages include specific options (not open-ended questions)
- Graceful degradation for optional components
- Log all errors for post-mortem analysis

### ❌ Anti-Patterns
- Retrying unrecoverable errors (wastes time/money)
- Silent failure (return empty result without indication)
- Escalating everything (alert fatigue)
- Vague escalation messages ("something went wrong")

## Exam Tips

🎯 Know the two escalation triggers: error threshold exceeded, and scope expansion beyond authorization.

🎯 The exam may present a multi-agent failure scenario — know which errors propagate up vs. stay local.

🎯 Graceful degradation: required components must succeed; optional components can fail silently (with logging).

## Quick Reference
- Recoverable: retry with backoff (rate limits, network, timeout)
- Unrecoverable: escalate immediately (permissions, safety, corruption)
- Error threshold: escalate after N consecutive failures
- Scope escalation: task larger than authorized → pause and ask
- Multi-agent: optional failures → degrade; required failures → propagate
- Escalation message: what was tried + specific error + concrete options

## Further Reading
- [Anthropic docs: Agentic safety](https://docs.anthropic.com/en/docs/build-with-claude/agents#building-safe-agentic-systems)

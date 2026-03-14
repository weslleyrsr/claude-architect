# Exercise 5.2 — Build an Escalation Manager

## Scenario

You're building an autonomous data processing pipeline. Some steps can fail and retry; others require immediate human intervention. Build an `EscalationManager` that classifies errors and routes them appropriately.

## Your Task

Implement an `EscalationManager` class with:

1. `classifyError(error: Error)` — returns `"retry"`, `"escalate"`, or `"degrade"`
2. `handleWithEscalation(step, fn)` — runs a function with automatic error classification
3. Error threshold tracking (escalate after 3 consecutive retries on same step)
4. An `escalationLog` that records all escalations

## Success Criteria (used by validator)

- [ ] Classifies errors correctly (retry vs escalate vs degrade)
- [ ] Escalates after 3 consecutive failures on same step
- [ ] Records escalations in a log with timestamp, step, and error
- [ ] Returns partial results for optional steps (degrade)
- [ ] Demo shows all three paths (retry success, escalation, degradation)

## Starter Code

See `starter.ts` / `starter.py` in this directory.

# Exercise 5.3 — Implement Review Gates

## Scenario

You're building a code modification agent that automatically applies changes. For safety, it needs review gates that trigger on certain conditions and pause for human approval.

## Your Task

Implement a `ReviewGatedAgent` class that:

1. Has configurable review gates (triggers + messages)
2. Before executing a task, evaluates all gates
3. If any gate triggers, pauses and presents the review to the user
4. Only proceeds after explicit approval
5. Logs all gate evaluations (triggered/not triggered)

## Success Criteria (used by validator)

- [ ] Review gates are configurable (not hardcoded)
- [ ] Multiple gates are evaluated for each task
- [ ] Triggered gates present a clear review message
- [ ] Requires explicit approval before proceeding
- [ ] Gate evaluation log is accessible
- [ ] Demo shows at least one gate triggering and one not triggering

## Starter Code

See `starter.ts` / `starter.py` in this directory.

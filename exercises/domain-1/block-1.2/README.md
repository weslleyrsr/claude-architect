# Exercise 1.2 — Design a Multi-Agent Research System

## Scenario

You're building a research assistant that investigates a topic from multiple angles simultaneously: one agent finds recent news, another finds academic context, and a third synthesizes everything into a report.

## Your Task

Implement an `OrchestratorAgent` class with a `research(topic: string)` method that:

1. Fans out to 3 simulated subagents **in parallel** (use Promise.all / asyncio.gather)
2. Each subagent gets an isolated prompt (no shared state)
3. The orchestrator aggregates the 3 results into a final report
4. If any subagent fails, the orchestrator handles it gracefully (uses what it has)

Subagents can be simulated (return mock data or call Claude with a focused prompt).

## Success Criteria (used by validator)

- [ ] Three distinct subagents are called (or simulated) with separate prompts
- [ ] Subagents run in parallel (Promise.all / asyncio.gather, not sequential)
- [ ] Orchestrator aggregates all results
- [ ] Failure of one subagent does not crash the orchestrator (graceful handling)
- [ ] Each subagent receives only the context it needs (no god-context)

## Starter Code

See `starter.ts` / `starter.py` in this directory.

## Hints

<details>
<summary>Hint 1 — Parallel execution</summary>
Use Promise.all() in TypeScript or asyncio.gather() in Python to run all three subagents concurrently. This is faster than awaiting them sequentially.
</details>

<details>
<summary>Hint 2 — Graceful failure</summary>
Use Promise.allSettled() in TypeScript (instead of Promise.all) to collect results even if some agents fail. Or use try/except around each gather item in Python.
</details>

<details>
<summary>Hint 3 — Isolated context</summary>
Each subagent call should start with its own messages array — don't pass the orchestrator's message history to subagents.
</details>

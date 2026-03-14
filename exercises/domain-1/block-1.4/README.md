# Exercise 1.4 — Build a Resumable Workflow

## Scenario

You're building a multi-step data processing pipeline that processes files one by one. The pipeline should be resumable — if it's interrupted, it should pick up from where it left off rather than reprocessing completed files.

## Your Task

Implement a `ResumablePipeline` class that:

1. Tracks completed steps in a JSON state file
2. On `run()`, skips steps that are already marked complete
3. Saves state after each step completes
4. On interruption (simulated with an early exit), resumes correctly on the next `run()` call

## Success Criteria (used by validator)

- [ ] State is saved to a JSON file after each step
- [ ] On second run, already-completed steps are skipped
- [ ] State file includes which steps are done and a timestamp
- [ ] Class can be instantiated with a state file path
- [ ] Demo shows interrupted run + successful resume

## Starter Code

See `starter.ts` / `starter.py` in this directory.

## Hints

<details>
<summary>Hint 1 — State structure</summary>
Save state as: `{ completedSteps: string[], lastUpdated: string }` to a JSON file using fs/json module.
</details>

<details>
<summary>Hint 2 — Simulating interruption</summary>
Throw an error (or return early) after the 2nd step to simulate interruption, then on second run show the first 2 steps are skipped.
</details>

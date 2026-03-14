# Exercise 1.3 — Implement a Workflow with Pre/Post Hooks

## Scenario

You're building a "document processing" workflow that: reads a document, transforms it, and saves the result. The workflow needs pre-execution validation hooks and post-execution logging hooks.

## Your Task

Implement a `WorkflowEngine` class that:

1. Accepts a list of steps (functions) and runs them in sequence
2. Fires registered **pre-step** hooks before each step
3. Fires registered **post-step** hooks after each step
4. A pre-step hook that returns `false` should **skip** that step
5. Demonstrates the workflow with a 3-step document processing pipeline

## Success Criteria (used by validator)

- [ ] WorkflowEngine accepts and stores hooks (pre and post)
- [ ] Pre-step hook can block a step (return false = skip)
- [ ] Post-step hook always fires after step (even for skipped steps, or only on executed — document your choice)
- [ ] Steps run in sequence
- [ ] Demo shows at least one hook blocking a step

## Starter Code

See `starter.ts` / `starter.py` in this directory.

## Hints

<details>
<summary>Hint 1 — Hook registration pattern</summary>
Use a Map or array to store pre/post hooks. Each hook is a function: (stepName, context) => boolean (pre) or void (post).
</details>

<details>
<summary>Hint 2 — Blocking a step</summary>
If any pre-hook returns false, skip the step body but still call post-hooks with a "skipped" status.
</details>

# Exercise 1.1 — Build a Bounded Agentic Loop

## Scenario

You're building a code review agent for a CI/CD pipeline. The agent should read a file, analyze it for issues, suggest fixes, and stop cleanly when done — **without** running forever if something goes wrong.

## Your Task

Implement a function `runCodeReviewAgent(filePath: string)` (or `run_code_review_agent(file_path: str)` in Python) that:

1. Implements a proper agentic loop with a **max 5 iterations** guard
2. Uses at minimum two simulated tools: `read_file` and `analyze_code`
3. Stops cleanly when `stop_reason === "end_turn"` (or equivalent)
4. Returns a summary of what was found

The tools can be simulated (return mock data) — the focus is on the **loop structure**, not the tools themselves.

## Success Criteria (used by validator)

- [ ] Loop has a max_iterations guard (≤ 5)
- [ ] Loop checks stop_reason to determine whether to continue
- [ ] Tool results are passed back into the next message (observe phase)
- [ ] Loop exits cleanly on "end_turn" without requiring max_iterations to trigger
- [ ] Code handles the case where max_iterations is reached (does not throw)

## Starter Code

See `starter.ts` / `starter.py` in this directory.

## Hints

<details>
<summary>Hint 1 — Loop structure</summary>
The core loop should be: while(iterations < MAX && !done) { call claude → check stop_reason → if tool_use: process tools, add to messages → if end_turn: done = true }
</details>

<details>
<summary>Hint 2 — Tool results format</summary>
Tool results must be added to the messages array as a `tool_result` content block with the matching `tool_use_id` from Claude's response.
</details>

<details>
<summary>Hint 3 — Stop reason</summary>
Check `response.stop_reason`. In the Anthropic SDK, "end_turn" means Claude is done. "tool_use" means it wants to call a tool.
</details>

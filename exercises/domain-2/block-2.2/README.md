# Exercise 2.2 — Implement Robust Tool Error Handling

## Scenario

You're building a web scraping agent. The `fetch_url` tool can fail with network errors (transient) or 404s (permanent). Design a tool wrapper that handles both cases correctly, with retry logic for transient failures.

## Your Task

Implement a `robustFetchTool` (or `robust_fetch_tool`) function that:

1. Wraps an HTTP fetch operation
2. Retries up to 3 times with exponential backoff for 5xx/network errors
3. Does NOT retry for 4xx errors (client errors are permanent)
4. Returns a structured `ToolResult` object (not throws)
5. Includes a `suggestion` in error responses

## Success Criteria (used by validator)

- [ ] Returns `{ success: boolean, data?, error?, retryable?, suggestion? }` structure
- [ ] Retries on 5xx/network errors (up to 3 times)
- [ ] Does NOT retry on 4xx errors
- [ ] Uses exponential backoff between retries (e.g. 1s, 2s, 4s)
- [ ] Returns structured error (does not throw to caller)

## Starter Code

See `starter.ts` / `starter.py` in this directory.

## Hints

<details>
<summary>Hint 1 — Retry classification</summary>
HTTP 5xx = server error = transient (retry). HTTP 4xx = client error = permanent (don't retry). Network error (no response) = transient (retry).
</details>

<details>
<summary>Hint 2 — Exponential backoff</summary>
Wait 1000 * 2^attempt milliseconds between retries: attempt 0 = 1s, attempt 1 = 2s, attempt 2 = 4s.
</details>

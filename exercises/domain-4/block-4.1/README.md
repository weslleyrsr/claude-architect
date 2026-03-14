# Exercise 4.1 — Build a Few-Shot Prompt System

## Scenario

You're building a customer support ticket classifier that categorizes tickets into: billing, technical, account, or feature-request. The classifier must be consistent and must output a specific JSON format.

## Your Task

Implement a `classifyTicket(text: string)` function (or `classify_ticket`) that:

1. Uses a system prompt to establish the classifier role and output format
2. Uses at least 3 few-shot examples in the prompt
3. Returns a typed result: `{ category: string, confidence: "high"|"medium"|"low", reasoning: string }`
4. Uses temperature 0 for consistency
5. Parses Claude's response into the typed structure

## Success Criteria (used by validator)

- [ ] Uses a system prompt with role and format specification
- [ ] Has at least 3 few-shot examples
- [ ] Uses temperature 0 (or low value ≤ 0.2)
- [ ] Returns a structured object with category, confidence, and reasoning
- [ ] Handles JSON parse errors gracefully (returns a default if parse fails)

## Starter Code

See `starter.ts` / `starter.py` in this directory.

## Hints

<details>
<summary>Hint 1 — Prompt structure</summary>
System prompt = role + format spec. User prompt = few-shot examples + the actual ticket to classify.
</details>

<details>
<summary>Hint 2 — JSON parsing</summary>
Wrap JSON.parse in try/catch. If Claude outputs markdown-wrapped JSON (```json ... ```), strip the code fences first.
</details>

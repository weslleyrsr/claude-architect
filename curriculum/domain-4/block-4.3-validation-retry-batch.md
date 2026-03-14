---
block: "4.3"
title: Validation, Retry & Batch Processing
domain: "4 — Prompt Engineering & Structured Output"
task-statements: ["4.4", "4.5"]
exam-weight: "20% (Domain 4 total)"
estimated-time: "~25 min"
---

# Block 4.3 — Validation, Retry & Batch Processing

## Why This Matters for the Exam

Task statements 4.4 and 4.5 test how to make Claude-based pipelines robust — validating outputs, retrying with corrective prompts when validation fails, and efficiently processing large amounts of data in batches.

## Core Concepts

### Output Validation Loop

Never trust Claude's output without validation. Build a validation loop:

```
Claude Response
      │
      ▼
Validate (schema, business rules, format)
      │
  ┌───┴───┐
  │       │
Pass    Fail
  │       │
  ▼       ▼
Use it  Retry with correction prompt
        (max N retries)
              │
           Still failing
              │
              ▼
         Escalate / use default
```

### Corrective Retry Pattern

When validation fails, send Claude feedback about what's wrong:

```typescript
async function withValidation<T>(
  prompt: string,
  validate: (result: T) => string | null,  // null = valid, string = error message
  maxRetries = 3
): Promise<T> {
  let messages: Anthropic.MessageParam[] = [{ role: "user", content: prompt }]

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const response = await callClaude(messages)
    const result = parseResponse<T>(response)
    const error = validate(result)

    if (!error) return result  // Valid!

    // Corrective prompt
    messages = [
      ...messages,
      { role: "assistant", content: response },
      { role: "user", content: `Your response had an error: ${error}. Please fix it and try again.` }
    ]
  }

  throw new Error("Max retries exceeded")
}
```

**Key insight:** The corrective prompt includes the error message — Claude uses it to fix the specific issue, not just retry blindly.

### Batch Processing Patterns

When processing many items, choose between:

**Pattern 1: Sequential (simple, no rate limit issues)**
```typescript
for (const item of items) {
  results.push(await processItem(item))
}
```

**Pattern 2: Parallel with concurrency limit (faster, controlled)**
```typescript
const CONCURRENCY = 5  // max parallel API calls

async function processBatch<T, R>(items: T[], process: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = []
  for (let i = 0; i < items.length; i += CONCURRENCY) {
    const batch = items.slice(i, i + CONCURRENCY)
    results.push(...await Promise.all(batch.map(process)))
  }
  return results
}
```

**Pattern 3: Anthropic Batches API (async, cost-effective)**
For large-scale processing (hundreds to thousands of items):
```typescript
const batch = await client.beta.messages.batches.create({
  requests: items.map((item, i) => ({
    custom_id: `item-${i}`,
    params: { model: "claude-haiku-4-5-20251001", max_tokens: 256, messages: [{ role: "user", content: item }] }
  }))
})
// Poll for completion...
```

### Rate Limiting and Backoff

When processing batches, respect API rate limits:
- Start conservative (5-10 concurrent requests)
- Watch for 429 errors — back off exponentially
- Use token-based counting (long prompts hit TPM limits faster)

### Cost Optimization for Batches

- Use smaller models (Haiku) for bulk classification tasks
- Cache repeated prompts (same system prompt, same examples)
- Use the Batches API for 50% cost reduction on async workloads
- Set appropriate `max_tokens` — don't request more than needed

## Key Patterns & Anti-Patterns

### ✅ Patterns
- Corrective retry: tell Claude what was wrong, not just "try again"
- Concurrency limits on batch processing (respect rate limits)
- Validate ALL Claude outputs before use
- Batches API for large-scale async processing

### ❌ Anti-Patterns
- Blind retry (no error message = Claude makes same mistake)
- Unlimited concurrency (hits rate limits, costs more)
- No validation (garbage in, garbage out downstream)
- Using Opus for bulk classification (use Haiku)

## Exam Tips

🎯 The corrective retry pattern is a key exam pattern — know that the retry includes the error message.

🎯 Batches API = async, 50% cheaper, for large scale. Know when to use it.

🎯 Know that blind retries ("try again") are less effective than corrective retries ("you missed field X, include it").

## Quick Reference
- Validate every Claude output before using
- Corrective retry = tell Claude specifically what failed
- Parallel batch: limit concurrency (5-10 concurrent max)
- Batches API: async, 50% cheaper, for 100+ items
- Use Haiku for bulk tasks, Sonnet/Opus for complex ones
- 429 error = rate limited, backoff exponentially

## Further Reading
- [Anthropic Batches API docs](https://docs.anthropic.com/en/docs/build-with-claude/message-batches)

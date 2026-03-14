---
block: "4.1"
title: Prompt Design & Few-Shot Learning
domain: "4 — Prompt Engineering & Structured Output"
task-statements: ["4.1", "4.2"]
exam-weight: "20% (Domain 4 total)"
estimated-time: "~25 min"
---

# Block 4.1 — Prompt Design & Few-Shot Learning

## Why This Matters for the Exam

Task statements 4.1 and 4.2 test foundational prompt engineering skills. The exam tests whether you know HOW to structure prompts for reliability, consistency, and specific output formats — not just "write a good prompt." Expect scenario questions about what's wrong with a prompt and how to fix it.

## Core Concepts

### Anatomy of an Effective Prompt

A well-structured prompt has these components:

```
┌─────────────────────────────────────────────┐
│  1. ROLE / PERSONA (optional but helpful)   │
│     "You are an expert code reviewer..."    │
├─────────────────────────────────────────────┤
│  2. CONTEXT                                 │
│     "The codebase is a TypeScript API..."   │
├─────────────────────────────────────────────┤
│  3. TASK (clear, specific instruction)      │
│     "Review the function below for..."      │
├─────────────────────────────────────────────┤
│  4. FORMAT SPECIFICATION                    │
│     "Output as JSON: {issues: [], score:}"  │
├─────────────────────────────────────────────┤
│  5. EXAMPLES (few-shot, if needed)          │
│     Input: ... → Output: ...               │
├─────────────────────────────────────────────┤
│  6. INPUT DATA                              │
│     [the actual content to process]         │
└─────────────────────────────────────────────┘
```

### Few-Shot Learning

Few-shot prompting provides examples (input → output pairs) that demonstrate the desired behavior:

```typescript
const prompt = `
Classify the sentiment of customer reviews.

Examples:
Review: "The product broke after 2 days"
Sentiment: negative

Review: "Works exactly as described, very happy"
Sentiment: positive

Review: "It's okay, nothing special"
Sentiment: neutral

Now classify:
Review: "${reviewText}"
Sentiment:`
```

**Why few-shot works:** Claude learns the pattern, tone, and format from examples — not just the label. The examples show the "vocabulary" and precision you expect.

**When to use few-shot:**
- When zero-shot gives inconsistent formatting
- When the task has domain-specific nuance hard to explain
- When you need Claude to match a very specific output style

### Prompt Clarity Principles

**Be specific, not abstract:**
```
❌ "Write good documentation"
✅ "Write a JSDoc comment for this function with: @param types, @returns description, and one @example"
```

**Constrain the output:**
```
❌ "Summarize this article"
✅ "Summarize this article in exactly 3 bullet points, each under 20 words"
```

**Separate concerns with XML tags:**
```
<context>
Background info here...
</context>

<task>
What I want Claude to do...
</task>

<output-format>
Format specifications...
</output-format>
```

### System vs. User Prompts

**System prompt:** Persistent instructions, persona, global rules
**User prompt:** Per-request content and task

Best practice: Put stable instructions in system, variable content in user:

```typescript
await client.messages.create({
  system: "You are a SQL expert. Always explain queries. Output as: {sql: string, explanation: string}",
  messages: [{
    role: "user",
    content: `Convert this to SQL: ${naturalLanguageQuery}`
  }]
})
```

### Temperature and Consistency

For structured output and code generation: **temperature: 0** or low values (0.1-0.3)
For creative tasks: higher values (0.7-1.0)

Low temperature = more deterministic, consistent output — critical when you need reliable JSON schemas or predictable formats.

## Key Patterns & Anti-Patterns

### ✅ Patterns
- XML tags to separate context from task from format spec
- Few-shot examples when zero-shot is inconsistent
- Temperature 0 for structured/JSON outputs
- Specific constraints ("under 50 words", "exactly 3 items")

### ❌ Anti-Patterns
- Vague instructions ("be helpful", "write good code")
- No format specification (Claude guesses)
- Too many examples (diminishing returns, token waste)
- Contradictory instructions in system and user prompts

## Exam Tips

🎯 The exam may show a bad prompt and ask what's wrong. Look for: vague task, no format spec, conflicting instructions.

🎯 Know the system/user prompt distinction — system is persistent across turns, user is per-message.

🎯 Few-shot = show examples. Zero-shot = no examples. The exam will use these terms.

## Quick Reference
- Prompt anatomy: role → context → task → format → examples → input
- Few-shot: provide input→output examples to demonstrate expected behavior
- System prompt: stable instructions; User prompt: per-request content
- Low temperature (0-0.3) for structured output
- XML tags help Claude parse complex prompts
- Specific constraints > vague requests

## Further Reading
- [Anthropic prompt engineering guide](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview)

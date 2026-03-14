---
block: "2.1"
title: Tool Design & Interfaces
domain: "2 — Tool Integration & Design"
task-statements: ["2.1"]
exam-weight: "18% (Domain 2 total)"
estimated-time: "~20 min"
---

# Block 2.1 — Tool Design & Interfaces

## Why This Matters for the Exam

Task statement 2.1 tests your ability to design tools that Claude can use effectively. The exam focuses on tool schema design: how to write descriptions that guide Claude correctly, how to structure input schemas, and common pitfalls that make tools hard to use.

## Core Concepts

### What Makes a Good Tool

A tool has three components:
1. **Name** — unique identifier (snake_case, no spaces)
2. **Description** — natural language explanation of what the tool does, when to use it, and any caveats
3. **Input schema** — JSON Schema defining the parameters

Claude uses the description to decide *whether* to call a tool and the schema to know *how* to call it.

### Tool Description Design

The description is the most important part. It should answer:
- What does this tool do?
- When should Claude call it (vs. alternatives)?
- What are the inputs and outputs at a high level?
- Any side effects or irreversibility?

```typescript
// ❌ Bad description — too vague
{
  name: "process",
  description: "Process something",
  ...
}

// ✅ Good description — specific and guiding
{
  name: "execute_sql_query",
  description: "Execute a read-only SQL SELECT query against the production database. Use for data retrieval only — does NOT support INSERT, UPDATE, DELETE. Returns rows as JSON array. Use search_documents for full-text search instead.",
  ...
}
```

### Input Schema Best Practices

Use JSON Schema to precisely define inputs:

```typescript
{
  name: "create_ticket",
  description: "Create a new support ticket in the system",
  input_schema: {
    type: "object",
    properties: {
      title: {
        type: "string",
        description: "Short summary of the issue (max 100 chars)",
        maxLength: 100
      },
      severity: {
        type: "string",
        enum: ["low", "medium", "high", "critical"],
        description: "Impact severity level"
      },
      assignee_email: {
        type: "string",
        format: "email",
        description: "Optional: email of user to assign to"
      }
    },
    required: ["title", "severity"]
  }
}
```

Key schema practices:
- Add `description` to every property (Claude reads these)
- Use `enum` for fixed sets of values
- Mark only truly required fields as `required`
- Use `format` hints (email, uri, date) where applicable

### Tool Granularity

**Too coarse:** One tool that does everything → Claude can't predict side effects, hard to reuse

**Too fine:** One tool per tiny action → Claude makes too many calls, context bloat

**Right size:** Tools map to meaningful operations that have clear, bounded effects

Rule of thumb: a tool should do one thing that makes sense to undo or audit as a unit.

### Dangerous Tool Marking

Tools with irreversible effects should say so clearly:

```typescript
{
  name: "delete_user_account",
  description: "IRREVERSIBLE: Permanently delete a user account and all associated data. Cannot be undone. Requires explicit user confirmation before calling.",
  ...
}
```

## Key Patterns & Anti-Patterns

### ✅ Patterns
- Descriptions mention alternatives ("use X instead if you need Y")
- Schema properties have their own descriptions
- Irreversible tools are labeled as such
- enums reduce ambiguity in categorical inputs

### ❌ Anti-Patterns
- Empty or one-word descriptions
- Required fields that should be optional
- Overlapping tools with unclear when-to-use guidance
- No mention of side effects

## Exam Tips

🎯 The exam may show you two tool definitions and ask which is better-designed. Look for: description quality, schema clarity, side effects flagged.

🎯 Know that Claude uses tool descriptions to decide *which* tool to call — they're not just documentation.

🎯 "enum" values in schemas reduce hallucinated values — use them for categorical inputs.

## Quick Reference
- Tool = name + description + input_schema
- Description guides *when* to call; schema guides *how* to call
- Add `description` to every schema property
- Label irreversible tools explicitly
- Use enums for categorical inputs
- Right granularity: one bounded, auditable operation

## Further Reading
- [Anthropic docs: Define tools](https://docs.anthropic.com/en/docs/build-with-claude/tool-use/implement-tool-use#define-tools)

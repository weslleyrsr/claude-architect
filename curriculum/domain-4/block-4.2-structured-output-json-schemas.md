---
block: "4.2"
title: Structured Output & JSON Schemas
domain: "4 — Prompt Engineering & Structured Output"
task-statements: ["4.3"]
exam-weight: "20% (Domain 4 total)"
estimated-time: "~25 min"
---

# Block 4.2 — Structured Output & JSON Schemas

## Why This Matters for the Exam

Task statement 4.3 tests your ability to reliably extract structured data from Claude. The exam focuses on prompt techniques for JSON output, schema enforcement, and common failure modes (markdown wrapping, schema drift, hallucinated fields).

## Core Concepts

### Reliable JSON Output Strategies

**Strategy 1: Prompt-based (instruction)**
Tell Claude explicitly what format to use:
```
Output ONLY valid JSON. No markdown code fences. No explanation.
Format: {"field1": "value", "field2": 123}
```

**Strategy 2: Tool use for structured output**
Use a fake "output" tool to force Claude into structured output:
```typescript
const outputTool: Anthropic.Tool = {
  name: "structured_output",
  description: "Output the final structured result",
  input_schema: {
    type: "object",
    properties: {
      result: { type: "string" },
      confidence: { type: "number" },
    },
    required: ["result", "confidence"]
  }
}
```
When Claude "calls" this tool, you get perfectly typed JSON via the tool's input parameter.

**Strategy 3: Prefill technique**
Start Claude's response with `{` to steer it toward JSON:
```typescript
messages: [
  { role: "user", content: "Classify this: ..." },
  { role: "assistant", content: "{" }  // prefill!
]
```

### JSON Schema Design for Claude

Claude handles JSON Schema well. Key schema patterns:

```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "string",
      "enum": ["active", "inactive", "pending"],
      "description": "Current status"
    },
    "items": {
      "type": "array",
      "items": { "type": "string" },
      "minItems": 1,
      "maxItems": 10
    },
    "metadata": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "created": { "type": "string", "format": "date-time" }
      }
    }
  },
  "required": ["status"],
  "additionalProperties": false
}
```

Key schema choices:
- `"additionalProperties": false` prevents hallucinated extra fields
- `enum` prevents invalid categorical values
- `required` array enforces presence
- `description` on properties guides Claude's understanding

### Common Failure Modes

**Markdown wrapping:**
```
```json
{"field": "value"}
```
```
Fix: Strip `` ```json `` and `` ``` `` fences before parsing.

**Schema drift:** Claude adds extra fields not in schema.
Fix: Use `additionalProperties: false` in schema description.

**Missing required fields:** Claude omits fields it "doesn't know."
Fix: Provide defaults in your post-processing, or prompt Claude to always include all fields.

**Type coercion:** Claude outputs `"123"` when you want `123`.
Fix: Specify types explicitly, validate after parsing.

### Post-Processing Pipeline

Always validate parsed JSON against your schema:

```typescript
function parseClaudeJson<T>(raw: string, schema: Schema): T {
  // 1. Strip markdown fences
  const cleaned = raw.replace(/^```(?:json)?\n?/m, "").replace(/\n?```$/m, "").trim()

  // 2. Parse JSON
  const parsed = JSON.parse(cleaned)

  // 3. Validate against schema
  const valid = validate(parsed, schema)
  if (!valid) throw new Error(`Schema validation failed: ${validate.errors}`)

  // 4. Return typed result
  return parsed as T
}
```

## Key Patterns & Anti-Patterns

### ✅ Patterns
- Use tool-use trick for guaranteed structured output
- Add `additionalProperties: false` to prevent hallucinated fields
- Strip markdown fences before JSON.parse
- Validate parsed output against schema
- Temperature 0 for structured output

### ❌ Anti-Patterns
- Trusting Claude's JSON without validation
- No schema on the prompt (Claude guesses the structure)
- Not handling markdown fences
- High temperature for structured output (inconsistent results)

## Exam Tips

🎯 The tool-use trick is a key exam pattern — using a fake tool to get guaranteed JSON structure.

🎯 Know the three common JSON failure modes: markdown wrapping, schema drift, missing fields.

🎯 `additionalProperties: false` is the fix for schema drift — memorize it.

## Quick Reference
- Strategy 1: Instruct Claude to output JSON only
- Strategy 2: Use tool_use as a structured output mechanism
- Strategy 3: Prefill assistant turn with `{`
- `additionalProperties: false` = no extra fields
- Always strip markdown fences before JSON.parse
- Validate parsed JSON against schema
- Temperature 0 for consistency

## Further Reading
- [Anthropic docs: Structured output](https://docs.anthropic.com/en/docs/build-with-claude/tool-use/extract-structured-data)

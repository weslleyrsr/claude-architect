# Exercise 4.2 — Reliable Structured Output Extraction

## Scenario

You need to extract structured data from unstructured meeting notes. The output must always conform to a specific schema, even when the notes are messy or incomplete.

## Your Task

Implement `extractMeetingData(notes: string)` that:

1. Uses the tool-use trick (fake output tool) OR prefill technique to guarantee JSON
2. Extracts: title, date (ISO format), attendees (array), action_items (array), decisions (array)
3. Returns a `MeetingData` typed object
4. Strips markdown fences from any Claude response before parsing
5. Returns sensible defaults for missing fields (empty arrays, "Unknown" for title, etc.)

## Success Criteria (used by validator)

- [ ] Uses tool_use trick OR instruction-only with fence stripping
- [ ] Always returns a MeetingData with all required fields
- [ ] Handles markdown-wrapped JSON (strips fences)
- [ ] Returns empty arrays (not null/undefined) for missing array fields
- [ ] Uses temperature 0

## Starter Code

See `starter.ts` / `starter.py` in this directory.

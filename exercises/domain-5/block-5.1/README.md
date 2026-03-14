# Exercise 5.1 — Build a Context-Aware Agent Loop

## Scenario

You're building a document analysis agent that processes many documents sequentially. After every 5 documents, the context would be too large — implement automatic context compaction by summarizing old findings.

## Your Task

Implement a `DocumentAnalyzer` class that:

1. Processes documents one by one, maintaining context
2. Tracks token usage (use a rough estimator: chars/4)
3. When approaching a configurable threshold (default: 10,000 estimated tokens), automatically compacts
4. Compaction = summarize the findings so far and replace detailed messages with the summary
5. Preserves all key findings across compaction

## Success Criteria (used by validator)

- [ ] Tracks estimated token usage as messages grow
- [ ] Triggers compaction at configurable threshold
- [ ] Compaction replaces detailed history with a summary
- [ ] Key findings are preserved after compaction
- [ ] Can process more documents than the threshold would normally allow

## Starter Code

See `starter.ts` / `starter.py` in this directory.

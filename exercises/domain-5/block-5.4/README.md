# Exercise 5.4 — Build a Provenance-Tracking Research Agent

## Scenario

You're building a research agent that answers questions using web search. Every fact it presents must have a source citation. Unsourced claims should be explicitly flagged as "from training knowledge (unverified)".

## Your Task

Implement `researchWithProvenance(question: string)` that:

1. Uses a search tool (simulated) to find relevant information
2. Tracks provenance for each claim (source URL or "training knowledge")
3. Formats output with inline citations
4. Explicitly flags any claims without tool-sourced evidence
5. Includes a sources list at the end

## Success Criteria (used by validator)

- [ ] Output includes source citations for factual claims
- [ ] Training knowledge claims are explicitly flagged as unverified
- [ ] A sources list is appended to the output
- [ ] The prompt instructs Claude to cite sources and flag uncertainty
- [ ] Uncited claims trigger a warning in the output

## Starter Code

See `starter.ts` / `starter.py` in this directory.

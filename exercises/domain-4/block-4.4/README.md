# Exercise 4.4 — Build a Generator + Critic Review System

## Scenario

You're building a code documentation generator that uses a generator-critic pattern: one Claude instance writes the documentation, another reviews it for accuracy and completeness, and the first revises based on the critique.

## Your Task

Implement `generateWithReview(code: string)` that:

1. Instance A generates initial documentation for the code
2. Instance B reviews the documentation (independently, with a critic system prompt)
3. Instance A revises based on the critique
4. Returns both the initial doc and the revised doc

## Success Criteria (used by validator)

- [ ] Uses two separate Claude calls (generator + critic)
- [ ] Critic receives the code AND the generated doc (not generator's reasoning)
- [ ] Reviser receives original code + critique
- [ ] Returns both initial and revised documentation
- [ ] Generator and critic have different system prompts

## Starter Code

See `starter.ts` / `starter.py` in this directory.

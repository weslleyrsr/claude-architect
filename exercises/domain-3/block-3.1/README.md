# Exercise 3.1 — Write a Production-Quality CLAUDE.md

## Scenario

You're setting up a new Node.js/TypeScript microservice project called "payment-processor". It handles sensitive financial data, uses PostgreSQL via Prisma, deploys to AWS, and has strict rules about security and testing.

## Your Task

Write a complete `CLAUDE.md` for this project that:

1. Has a clear project overview (2-3 sentences)
2. Lists 4-5 critical rules with rationale (why each rule exists)
3. Includes an architecture overview with key file structure
4. Documents the tech stack
5. Includes at least one security-specific rule (about PII/financial data)

## Success Criteria (used by validator)

- [ ] Has a "Critical Rules" section with at least 4 rules
- [ ] At least one rule mentions rationale (why it exists)
- [ ] Has an architecture or project structure section
- [ ] Has a tech stack section
- [ ] Mentions security or PII concerns explicitly
- [ ] Is under 300 lines (focused, not bloated)

## Starter Code

See `starter.ts` in this directory (the CLAUDE.md content goes in a template string).

## Hints

<details>
<summary>Hint 1 — Rule structure</summary>
Good rule format: "**Do X** — [rationale: why this matters or what happened when we didn't]"
</details>

<details>
<summary>Hint 2 — What to include</summary>
Think about: What would a new developer need to know? What mistakes would Claude make without guidance? What are the irreversible actions? What PII is in scope?
</details>

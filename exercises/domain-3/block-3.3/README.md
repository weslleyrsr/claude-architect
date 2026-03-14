# Exercise 3.3 — Write a Plan Mode Skill

## Scenario

Your team wants a skill that helps safely refactor TypeScript files. Before making any changes, the skill must show a detailed plan and wait for approval.

## Your Task

Create `.claude/skills/safe-refactor.md` — a skill that:

1. Enters Plan Mode when invoked
2. Reads the target files and analyzes what needs to change
3. Presents a numbered, step-by-step refactoring plan
4. Waits for human approval ("Approved" / "modify step X")
5. Only exits Plan Mode and executes after explicit approval

Write the skill as a complete markdown file with proper frontmatter.

## Success Criteria (used by validator)

- [ ] Skill has `name:` and `description:` frontmatter
- [ ] Skill instructs Claude to enter Plan Mode
- [ ] Plan is presented as numbered steps
- [ ] Skill explicitly waits for human approval before executing
- [ ] Skill instructions mention exiting Plan Mode after approval

## Starter Code

See `starter.ts` / `starter.py` for the validator.

## Hints

<details>
<summary>Hint 1</summary>
The skill body should say "Use EnterPlanMode" and later "After approval, use ExitPlanMode". Between them, describe the planning steps.
</details>

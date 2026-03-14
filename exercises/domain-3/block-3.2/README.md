# Exercise 3.2 — Create a Command + Skill Pair

## Scenario

Your team needs a `/standup` command that generates a daily standup report from recent git commits. The report generation logic should be a reusable skill (so other commands can also trigger it).

## Your Task

Create two files:
1. `.claude/commands/standup.md` — the slash command
2. `.claude/skills/generate-standup.md` — the reusable skill

The command should:
- Accept an optional time period as `$ARGUMENTS` (default: "today")
- Invoke the `generate-standup` skill

The skill should:
- Have a trigger description that makes sense
- Read recent git commits
- Format a standup report with: What was done, What's planned, Any blockers

## Success Criteria (used by validator)

- [ ] Command file has `description:` frontmatter
- [ ] Command body references `$ARGUMENTS` or has a default time period
- [ ] Command explicitly invokes the `generate-standup` skill
- [ ] Skill file has `name:` and `description:` frontmatter
- [ ] Skill description is written for Claude (triggering conditions)
- [ ] Skill body has structured standup format (done/planned/blockers)

## Starter Code

See `starter.ts` / `starter.py` — these validate the file structure of your command and skill.

## Hints

<details>
<summary>Hint 1 — Command structure</summary>
The command should be a short orchestrator: set up context, then say "invoke the generate-standup skill".
</details>

<details>
<summary>Hint 2 — Skill description</summary>
Write it like: "Use when generating a git standup report, or when the user asks for a summary of recent commits."
</details>

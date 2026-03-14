# Exercise 3.4 — Write a GitHub Actions Workflow with Claude

## Scenario

Your team wants an automated PR reviewer using Claude Code that runs on every pull request, posts review comments, and fails the CI check if critical issues are found.

## Your Task

Write a GitHub Actions workflow YAML file (`.github/workflows/ai-review.yml`) that:

1. Triggers on pull_request events
2. Installs Claude Code
3. Gets the PR diff
4. Runs Claude non-interactively to review the diff
5. Fails the CI step if Claude finds critical issues (exit code 1)
6. Posts the review as a PR comment (or just outputs to log)

Write the workflow as a complete, valid YAML file.

## Success Criteria (used by validator)

- [ ] Triggers on `pull_request`
- [ ] Uses `ANTHROPIC_API_KEY` from secrets (not hardcoded)
- [ ] Installs Claude Code via npm
- [ ] Uses `claude -p` (non-interactive mode) with a review prompt
- [ ] Handles Claude's output (doesn't silently ignore it)
- [ ] Sets a timeout for the Claude step

## Starter Code

See `starter.ts` / `starter.py` — these validate your YAML structure.

## Hints

<details>
<summary>Hint 1 — Getting the diff</summary>
Use `git diff origin/${{ github.base_ref }}...HEAD` to get the PR diff, then pipe it to claude.
</details>

<details>
<summary>Hint 2 — Non-interactive flag</summary>
Use `claude -p "your prompt"` with stdin piped from the diff file.
</details>

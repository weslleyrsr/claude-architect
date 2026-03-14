---
block: "3.4"
title: CI/CD Integration
domain: "3 — Claude Code Configuration & Customization"
task-statements: ["3.6"]
exam-weight: "20% (Domain 3 total)"
estimated-time: "~20 min"
---

# Block 3.4 — CI/CD Integration

## Why This Matters for the Exam

Task statement 3.6 tests how Claude Code integrates into automated pipelines — running non-interactively, integrating with GitHub Actions/GitLab CI, and the considerations for running Claude in headless/automated mode vs. interactive sessions.

## Core Concepts

### Claude Code in CI/CD

Claude Code can run non-interactively using the `-p` flag:

```bash
# Run a Claude command non-interactively
claude -p "Review this PR diff and output a JSON summary of issues found" < diff.txt

# Or with a specific command
claude --headless -p "Run tests and fix any failures"
```

This enables Claude to participate in CI/CD pipelines as an automated reviewer, fixer, or analyst.

### GitHub Actions Integration

```yaml
name: AI Code Review
on: [pull_request]

jobs:
  ai-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Claude Code
        run: npm install -g @anthropic-ai/claude-code

      - name: AI Review
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          git diff origin/main...HEAD | claude -p \
            "Review this diff for bugs, security issues, and style violations. Output as JSON." \
            > review.json

      - name: Post Review Comment
        uses: actions/github-script@v7
        with:
          script: |
            const review = require('./review.json')
            // Post review.issues as PR comment
```

### Headless vs. Interactive Mode

| Aspect | Interactive | Headless/CI |
|--------|-------------|-------------|
| User input | Yes | No |
| Tool approval | Prompts user | Auto-approve or deny |
| Output | Rich UI | Stdout/stderr |
| Session | Persistent | Single run |
| Error handling | User decides | Script must handle |

**Key consideration:** In CI, you must configure which tools are allowed without prompting. Use `--allowedTools` or settings to pre-approve safe tools.

### Non-Interactive Permission Model

In headless mode, Claude cannot ask the user for permission. You must:
1. Pre-approve safe tools in `.claude/settings.json`
2. Use `--allowedTools` flag to specify permitted tools
3. Design the task to not require dangerous tool approvals

```json
{
  "nonInteractiveMode": true,
  "allowedTools": ["Read", "Grep", "Bash(git log)", "Bash(npm test)"],
  "deniedTools": ["Write", "Bash(rm)"]
}
```

### Output Formatting for CI

When running in CI, structure outputs for machine consumption:

```bash
# Output JSON for downstream steps
claude -p "Analyze test failures and return JSON: {failures: [], suggestions: []}" < test-output.txt

# Output markdown for GitHub comment
claude -p "Review this code and output a markdown summary" < code.ts
```

### Triggers for AI in CI/CD

Common CI triggers for Claude:
- PR opened/updated → automatic code review
- Tests failed → automatic failure analysis
- Build failed → root cause identification
- New dependency added → security scan
- Deploy completed → smoke test generation

## Key Patterns & Anti-Patterns

### ✅ Patterns
- Use `--headless` flag for non-interactive runs
- Pre-approve only safe, read-only tools in CI
- Output structured JSON for machine-readable results
- Store `ANTHROPIC_API_KEY` in CI secrets (never in code)
- Set reasonable timeout limits for CI steps

### ❌ Anti-Patterns
- Running Claude with write permissions in CI without review gates
- Not handling Claude's output parsing failures
- Hardcoding API keys in CI config
- Unlimited token budgets in CI (set `max_tokens` limits)

## Exam Tips

🎯 The exam tests `-p` flag knowledge — this is how you run Claude non-interactively.

🎯 Know that CI mode needs pre-approved tools (can't prompt user).

🎯 Security: `ANTHROPIC_API_KEY` must be in CI secrets, never in config files.

## Quick Reference
- `claude -p "prompt"` = non-interactive headless mode
- CI needs pre-approved tools (no user to approve at runtime)
- Store API key in CI secrets: `${{ secrets.ANTHROPIC_API_KEY }}`
- Output JSON in CI for machine-readable results
- Set token/cost limits for CI runs
- Common CI uses: PR review, test failure analysis, security scanning

## Further Reading
- [Claude Code CI/CD integration](https://docs.anthropic.com/en/docs/claude-code/github-actions)

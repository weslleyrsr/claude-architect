---
name: generate-standup
description: Use when generating a git standup report, creating a summary of recent commits, or when the user asks "what did I work on" or "what should I report for standup". Also invoke when /standup command is used.
---

# Generate Standup Report

Generate a formatted standup report from recent git activity.

## Step 1: Get Recent Commits

Run: `git log --oneline --since="24 hours ago" --author="$(git config user.name)"`

If a time period was specified (from $ARGUMENTS), use that instead:
- "today" → `--since="midnight"`
- "yesterday" → `--since="yesterday midnight" --until="midnight"`
- "this week" → `--since="monday"`

## Step 2: Format the Report

Output in this format:

```
📋 Standup Report — [Date]

✅ DONE (Yesterday/Last period)
• [Commit summary 1]
• [Commit summary 2]
• [Group related commits into themes]

📋 PLANNED (Today)
• [Infer from in-progress work or ask the user]
• [Or: "Continue work on [last commit topic]"]

🚧 BLOCKERS
• [Ask: "Any blockers to mention?" — if none, write "None"]
```

## Step 3: Polish

- Group commits by feature/area (don't list 10 tiny commits separately)
- Convert commit messages to human-readable summaries
- Ask about blockers if not obvious from commits

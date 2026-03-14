---
description: Generate a daily standup report from recent git commits
argument-hint: "[time-period]"
---

# /standup

Generate a standup report for the team.

Time period: $ARGUMENTS (default: "today" if no argument provided)

Invoke the `generate-standup` skill to:
1. Read recent git commits for the specified time period
2. Format them into standup format (done / planned / blockers)
3. Output in a format ready to paste into Slack or a standup tool

---
name: enroll
description: First-time student enrollment — collects info, creates branch, initializes progress
---

# Enrollment Flow

You are enrolling a new student in the Claude Certified Architect – Foundations exam prep.

## Step 1: Welcome

Display a warm welcome:

> Welcome to the **Claude Certified Architect – Foundations** AI-guided exam prep!
>
> This experience guides you through 18 study blocks covering all 5 exam domains, with hands-on exercises, knowledge checks, and personalized progress tracking.
>
> Let me get you set up. This will take about 2 minutes.

## Step 2: Collect Student Info

Ask these questions (one at a time, conversationally):

**Question 1 — Name:**
> What's your name? (This will be used to personalize your experience and name your git branch.)

**Question 2 — Language Preference:**
> Which language do you prefer for coding exercises?
> 1. TypeScript
> 2. Python

**Question 3 — Experience Level:**
> How would you describe your experience with Claude and the Anthropic API?
> 1. Beginner — I'm new to Claude APIs and agentic systems
> 2. Intermediate — I've used the Claude API or built some Claude-powered tools
> 3. Advanced — I've built production systems with Claude, multi-agent pipelines, or MCP servers

## Step 3: Create Student Branch

Use MCP tool `git_create_branch` with:
- `name`: `"student/<lowercase-name>-<unix-timestamp>"`
  - Example: `"student/alice-1710000000"`
  - Get the timestamp with a bash command: `date +%s`

## Step 4: Initialize Progress

Use MCP tool `progress_write` with:
```json
{
  "data": {
    "name": "<student name>",
    "language": "<ts or py>",
    "level": "<beginner|intermediate|advanced>",
    "startedAt": "<ISO date string>",
    "completedAt": null,
    "blocks": {}
  }
}
```

## Step 5: Show Personalized Welcome + Study Plan

Based on their experience level, show a tailored message:

**Beginner:**
> Perfect starting point! We'll take this step by step. Domain 1 (Agentic Systems) is a great foundation — we'll build up your mental models before diving into hands-on Claude Code work.

**Intermediate:**
> Nice! You've got some Claude experience to build on. I'll offer Jedi Mode for blocks where you might already know the material — you can fast-track through content you're comfortable with.

**Advanced:**
> You're well positioned for this exam. I'll offer Jedi Mode on every block — you can likely fast-track through several domains and focus your time on exam-specific nuances.

Then display the recommended study order:
```
📚 Your Recommended Study Order
(highest exam weight first)

1. Domain 1 — Agentic Systems         27% of exam  ~105 min
2. Domain 3 — Claude Code Config       20% of exam  ~85 min
3. Domain 4 — Prompt Engineering       20% of exam  ~95 min
4. Domain 2 — Tool Integration         18% of exam  ~70 min
5. Domain 5 — Production Operations   15% of exam  ~90 min
                                      ─────────────────────
                                 Total: ~445 min (~7.5 hrs)
```

## Step 6: Offer to Start

> Ready to begin with Block 1.1 — Agentic Loops (~25 min)?
> Or type the name of any block/domain you'd like to start with.

When they're ready, invoke the `study-block` skill with block `1.1`.

---
block: "3.2"
title: Custom Commands & Skills
domain: "3 — Claude Code Configuration & Customization"
task-statements: ["3.2", "3.3"]
exam-weight: "20% (Domain 3 total)"
estimated-time: "~25 min"
---

# Block 3.2 — Custom Commands & Skills

## Why This Matters for the Exam

Task statements 3.2 and 3.3 test your ability to create slash commands and skills for Claude Code. The exam distinguishes between commands (user-invocable, top-level) and skills (invoked by Claude internally), and tests whether you understand frontmatter, argument passing, and skill triggering.

## Core Concepts

### Slash Commands vs. Skills

| Aspect | Slash Command | Skill |
|--------|-------------|-------|
| Invoked by | User typing `/command` | Claude (triggered by patterns) |
| Location | `.claude/commands/` | `.claude/skills/` |
| Frontmatter | `description:` | `name:`, `description:` |
| Trigger | Explicit user action | AI decides when to invoke |

**Commands** are like menu items — the user explicitly calls them.
**Skills** are like Claude's internal procedures — Claude invokes them when it recognizes a matching situation.

### Command Frontmatter

```markdown
---
description: Brief description shown in command palette
allowed-tools: [Read, Write, Bash]   # optional tool restrictions
argument-hint: "<file-path>"          # optional hint shown to user
---

# /my-command

Command body here...
```

### Skill Frontmatter

```markdown
---
name: my-skill
description: When to trigger this skill — written for Claude, not humans
---

# My Skill

Skill body here — instructions Claude follows when triggered...
```

The `description` in a skill is critical — it's what Claude reads to decide whether to invoke it. Write it from Claude's perspective: "Use when the user asks to X or when Y situation occurs."

### Dynamic Arguments in Commands

Commands can reference user-provided arguments:

```markdown
---
description: Review a pull request
---

# /review-pr

Review PR #$ARGUMENTS from GitHub.

1. Fetch the PR diff...
```

When user types `/review-pr 123`, `$ARGUMENTS` becomes `"123"`.

### Skill Invocation Patterns

Claude invokes a skill when:
1. The skill's `description` matches the current situation
2. Another skill or command explicitly says "invoke the X skill"
3. The skill is mentioned by name in a system prompt or CLAUDE.md

### Command Organization

Commands can be nested in subdirectories:
```
.claude/commands/
├── study.md          → /study
├── deploy/
│   ├── staging.md    → /deploy staging
│   └── prod.md       → /deploy prod
└── db/
    └── migrate.md    → /db migrate
```

## Key Patterns & Anti-Patterns

### ✅ Patterns
- Command descriptions are user-facing (what will this do for me?)
- Skill descriptions are Claude-facing (when should I use this?)
- Commands are explicit entry points; skills are reusable procedures
- Skills invoke other skills for modularity

### ❌ Anti-Patterns
- Commands without descriptions (disappear from command palette UI)
- Skill descriptions that are too vague ("use for various things")
- Commands that try to do everything (should be narrow and focused)
- Passing secrets via $ARGUMENTS

## Exam Tips

🎯 The exam tests the command vs. skill distinction — know which is user-invoked vs. Claude-invoked.

🎯 Skill `description` is the trigger criterion — Claude reads it to decide if the skill applies.

🎯 `$ARGUMENTS` in commands captures everything after the command name.

## Quick Reference
- Commands: `.claude/commands/` — user types `/name`
- Skills: `.claude/skills/` — Claude decides when to invoke
- Command frontmatter: `description` (required)
- Skill frontmatter: `name` + `description` (both required)
- `$ARGUMENTS` = user-supplied argument string in commands
- Skills invoke other skills for modularity

## Further Reading
- [Claude Code slash commands docs](https://docs.anthropic.com/en/docs/claude-code/slash-commands)

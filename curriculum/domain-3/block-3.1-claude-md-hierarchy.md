---
block: "3.1"
title: CLAUDE.md Hierarchy & Project Context
domain: "3 — Claude Code Configuration & Customization"
task-statements: ["3.1"]
exam-weight: "20% (Domain 3 total)"
estimated-time: "~20 min"
---

# Block 3.1 — CLAUDE.md Hierarchy & Project Context

## Why This Matters for the Exam

Task statement 3.1 tests your understanding of how Claude Code loads context via CLAUDE.md files. The exam tests the override hierarchy, what belongs in CLAUDE.md vs. other config, and how to structure project context for AI effectiveness.

## Core Concepts

### What Is CLAUDE.md?

CLAUDE.md is a special markdown file that Claude Code automatically reads and includes in every conversation's system context. It's how you give Claude persistent, project-specific instructions without repeating them every session.

```
Session opens
     │
     ▼
Claude Code reads CLAUDE.md files (hierarchy)
     │
     ▼
CLAUDE.md content injected into system context
     │
     ▼
Your conversation starts with full project context
```

### The CLAUDE.md Hierarchy

Multiple CLAUDE.md files can exist at different levels:

```
~/.claude/CLAUDE.md              ← User-level (applies to ALL projects)
~/projects/my-app/CLAUDE.md     ← Project-level (applies to this project)
~/projects/my-app/src/CLAUDE.md ← Directory-level (applies when in src/)
```

**Resolution order:** More specific files add to, not replace, less specific ones. All matching files are loaded and concatenated.

**User-level** (`~/.claude/CLAUDE.md`): Personal preferences, global style rules, preferred tools
**Project-level** (`./CLAUDE.md`): Project architecture, rules, conventions, tech stack
**Directory-level** (subdirectory CLAUDE.md): Module-specific rules (e.g., "this directory uses a different coding style")

### What Belongs in CLAUDE.md

**Good candidates:**
- Project architecture overview (what files are where, key patterns)
- Critical rules Claude must always follow ("never commit to main")
- Tech stack and conventions ("use pnpm, not npm")
- Domain context ("this is a financial system — never log PII")
- Common gotchas ("the API uses snake_case but the DB uses camelCase")

**Bad candidates:**
- Ephemeral state ("currently working on feature X") — goes in session notes
- Tool configurations — goes in `.mcp.json` or settings files
- Secrets — never in CLAUDE.md
- Very long documentation — link to docs, don't paste them

### Writing Effective CLAUDE.md

Structure matters. Claude reads CLAUDE.md like a human would — hierarchy and emphasis matter:

```markdown
# Project Name — Purpose

## Critical Rules (Always Follow)
- Rule 1 — specific, actionable, with rationale
- Rule 2 — ...

## Architecture Overview
Brief description of how the system fits together

## Tech Stack
- Language: TypeScript (Node.js 20)
- Database: PostgreSQL via Prisma
- Testing: Vitest

## Common Patterns
...
```

Use "Critical" or "Always" for rules you want Claude to never violate. Claude respects emphasis.

### CLAUDE.md vs. .claude/settings.json

| Config | Location | Purpose |
|--------|----------|---------|
| CLAUDE.md | Project root | Natural language instructions for Claude |
| .claude/settings.json | .claude/ | Hooks, permissions, behavior settings |
| .mcp.json | Project root | MCP server registrations |

## Key Patterns & Anti-Patterns

### ✅ Patterns
- Short, focused CLAUDE.md (under 300 lines for a project)
- Rules with rationale ("never mock DB — we got burned when mocks diverged from prod")
- Architecture overview helps Claude understand code without reading every file
- Link to docs rather than pasting large sections

### ❌ Anti-Patterns
- Empty CLAUDE.md or generic boilerplate
- Rules without context (Claude can't apply them in edge cases)
- Secrets or credentials
- Conflicting rules between levels

## Exam Tips

🎯 The hierarchy is additive — more specific CLAUDE.md files ADD to context, not replace.

🎯 User-level CLAUDE.md applies to all projects (useful for personal style preferences).

🎯 Know the three locations: user (~/.claude/), project (./), and directory (subdir/).

## Quick Reference
- CLAUDE.md = auto-loaded project context for every session
- Hierarchy: user → project → directory (all loaded, additive)
- Use for: rules, architecture, conventions, tech stack
- Never use for: secrets, ephemeral state, very long docs
- More specific files ADD context, don't override

## Further Reading
- [Claude Code CLAUDE.md documentation](https://docs.anthropic.com/en/docs/claude-code/memory)

# Claude Certified Architect — Foundations: AI-Guided Exam Prep

## What This Repo Is

This repository is an **AI-guided, interactive exam prep experience** for the **Claude Certified Architect – Foundations** certification. Students interact with Claude Code via slash commands and skills; Claude guides them through theory, hands-on exercises, and knowledge checks block by block.

The exam guide PDF is at the root: `Claude-Certified-Architect-Foundations-Certification-Exam-Guide.pdf`

---

## Critical Rules (Always Follow)

### Student Branch Isolation
- Student data **NEVER** goes on `main`
- Student branches follow the pattern: `student/<name>-<timestamp>`
- The `progress/` directory is gitignored on `main` but tracked on student branches
- **Never commit progress/ to main under any circumstances**

### Progress & Git Operations
- **Always use the MCP tools** for git operations, never raw shell commands
- MCP tools: `git_create_branch`, `git_commit_progress`, `git_push_branch`
- Progress tools: `progress_read`, `progress_write`
- Exercise validation: `validate_exercise`

### Student Identity
- Always **greet the student by name** (loaded from `progress/student.json` via SessionStart hook)
- If student context is available in STUDENT_CONTEXT, use it to personalize every interaction
- Track language preference (TypeScript or Python) and use it throughout exercises

### After Every Block
- **Always trigger the `block-report` skill** before ending a session after any block completion
- Reports go in `progress/reports/block-X.Y-report.md`
- Commit via `git_commit_progress` after writing the report

---

## Repository Layout

```
curriculum/           Theory markdown per block (read-only on student branches)
exercises/            Code scaffolds per block (starter.ts / starter.py / solution/)
mcp-server/           Local MCP server providing git + progress + validation tools
progress/             Student-only: student.json + reports/ (gitignored on main)
.claude/commands/     /study entry point command
.claude/skills/       enroll, jedi-mode, study-block, block-report
.claude/hooks/        session-start.sh (loads student context)
```

---

## Curriculum Overview (18 + 2 blocks)

**Recommended study order (highest exam weight first):**

| Order | Domain | Blocks | Weight |
|-------|--------|--------|--------|
| 1st | D1 — Agentic Systems | 1.1 → 1.4 | 27% |
| 2nd | D3 — Claude Code | 3.1 → 3.4 | 20% |
| 3rd | D4 — Prompt Engineering | 4.1 → 4.4 | 20% |
| 4th | D2 — Tool Integration | 2.1 → 2.3 | 18% |
| 5th | D5 — Production | 5.1 → 5.4 | 15% |
| Final | Mock + Weak Areas | F.1, F.2 | — |

---

## MCP Server

The local MCP server at `mcp-server/` provides all git and progress operations. It must be running for the study experience to work. It is auto-started via `.mcp.json`.

**Requires:** `ANTHROPIC_API_KEY` in environment (used by `validate_exercise` tool)

---

## How to Get Started

New students: Run `/study` in Claude Code — enrollment is fully guided.
Returning students: Session start hook automatically loads your context.

---

## Meta Note (Domain 3)

Domain 3 covers CLAUDE.md files, custom commands, skills, and hooks — features the student is *actively using*. This experiential learning is intentional: the student is studying the very system they're interacting with.

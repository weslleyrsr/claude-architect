# Claude Certified Architect — Foundations: AI-Guided Exam Prep

> An interactive, AI-guided study experience for the **Claude Certified Architect – Foundations** certification — entirely inside Claude Code.

---

## What Is This?

This repo transforms your Claude Code session into a personalized exam tutor. Through slash commands and skills, Claude guides you block by block through all 5 exam domains: theory, hands-on exercises, and knowledge checks — with progress tracked on your personal git branch.

**20 study blocks** | **5 domains** | **TypeScript or Python** | **Jedi Mode skip system** | **Personalized block reports**

---

## Quick Start

### Prerequisites

- [Claude Code](https://claude.ai/claude-code) installed
- Node.js 20+
- Git

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/weslleyrsr/claude-architect.git
cd claude-architect

# 2. Install MCP server dependencies
cd mcp-server
npm install
npm run build
cd ..

# 3. Open in Claude Code
claude .

# 4. Start studying
/study
```

That's it. Claude handles everything from here.

---

## How It Works

### Your First Session

When you run `/study` for the first time, Claude will:
1. Ask your name, language preference (TypeScript/Python), and experience level
2. Create a personal git branch: `student/<your-name>-<timestamp>`
3. Show your personalized study plan with recommended order
4. Start you on Block 1.1

### Returning Sessions

The session start hook automatically loads your progress. Claude greets you by name and shows your dashboard.

### Study Block Flow

Each of the 18 study blocks follows this pattern:

```
① Jedi Mode (optional fast-track assessment)
② Theory — interactive walkthrough with ASCII diagrams
③ Exercise — write real code, Claude validates it
④ Knowledge Check — 3 exam-style questions
⑤ Block Report — personalized write-up committed to your branch
```

### Jedi Mode

If you already know a topic, Jedi Mode lets you fast-track through it:
- 5 scenario questions, 80%+ = block marked complete
- Score below 80% = study only the subtopics you missed

### Progress Tracking

All progress is stored on your student branch in `progress/student.json` and `progress/reports/`. Main branch stays clean — your data never touches it.

---

## Repository Structure

```
CLAUDE.md                    Always-loaded project context
.mcp.json                    MCP server configuration
.claude/
  commands/study.md          /study entry point
  skills/
    enroll.md                First-time setup
    jedi-mode.md             Fast-track assessment
    study-block.md           Theory + exercise + quiz runner
    block-report.md          Report writer + committer
  hooks/session-start.sh     Auto-loads student context
  settings.json              Hook registration

curriculum/
  domain-1/ through domain-5/    Theory markdown (18 blocks)
  final-prep/                    Mock exam + weak area review

exercises/
  domain-1/ through domain-5/    Code scaffolds + solutions
    block-X.Y/
      README.md              Exercise instructions + rubric
      starter.ts             TypeScript starter
      starter.py             Python starter
      solution/              Reference implementations

mcp-server/                  Local TypeScript MCP server
  src/
    index.ts                 Server entry point
    tools/
      git.ts                 Branch + commit + push tools
      progress.ts            Read + write student progress
      validator.ts           Exercise rubric validation (Claude API)

progress/                    Student data (gitignored on main)
  student.json               Your progress state
  reports/                   Block completion reports
```

---

## Exam Overview

| Domain | Topic | Weight | Blocks |
|--------|-------|--------|--------|
| D1 | Agentic Systems & Orchestration | 27% | 1.1–1.4 |
| D2 | Tool Integration & Design | 18% | 2.1–2.3 |
| D3 | Claude Code Configuration | 20% | 3.1–3.4 |
| D4 | Prompt Engineering & Output | 20% | 4.1–4.4 |
| D5 | Production Operations & Safety | 15% | 5.1–5.4 |

**Recommended study order:** D1 → D3 → D4 → D2 → D5 → Final Prep

---

## MCP Server Tools

The local MCP server provides these tools (used internally by skills):

| Tool | Purpose |
|------|---------|
| `git_create_branch` | Create student branch |
| `git_commit_progress` | Commit progress to student branch |
| `git_push_branch` | Push student branch to remote |
| `progress_read` | Read student.json |
| `progress_write` | Update student.json (deep merge) |

---

## Architecture Notes

- **Approach:** Hybrid plugin — skills + commands + local MCP server
- **State:** `progress/student.json` on student branch only
- **Git ops:** All via MCP tools, never raw shell commands
- **Validation:** Claude evaluates exercises inline — no external API call needed
- **Isolation:** Student data lives on `student/<name>-<ts>` branches — main is always clean

---

## Troubleshooting

**MCP server not connecting:**
```bash
cd mcp-server && npm run build
```

**Progress not saving:**
```bash
# Verify you're on a student branch
git branch
# Should show: student/your-name-timestamp
```

---

## Contributing

This repo is the curriculum template — students work on their own branches. To improve curriculum content or exercises, submit PRs to `main`.

---

## License

MIT — study materials are free to use and adapt.

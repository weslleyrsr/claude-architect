---
block: "5.3"
title: Large Codebases & Human Review
domain: "5 — Production Operations & Safety"
task-statements: ["5.4", "5.5"]
exam-weight: "15% (Domain 5 total)"
estimated-time: "~25 min"
---

# Block 5.3 — Large Codebases & Human Review

## Why This Matters for the Exam

Task statements 5.4 and 5.5 test how to effectively use Claude with large codebases and when to require human review. These are practical production concerns — the exam tests strategies for context management at scale and when autonomous action is appropriate vs. requiring human oversight.

## Core Concepts

### Strategies for Large Codebases

Claude can't load an entire large codebase into its context. Strategies:

**Strategy 1: Map before diving**
First build a high-level map, then load only what's needed:
```
Step 1: Run glob/find to get file structure → understand architecture
Step 2: Read README, key config files → understand tech stack
Step 3: For the specific task, load only relevant files
```

**Strategy 2: Progressive disclosure**
Start broad, then narrow:
```
1. Read package.json / pyproject.toml (dependencies)
2. Read main entry point
3. Follow imports to the specific component you need
4. Read only that component's file + its direct dependencies
```

**Strategy 3: Semantic search**
Use grep/search to find relevant code without reading everything:
```bash
# Find all places that handle authentication
grep -r "authenticate\|authMiddleware\|checkToken" src/ --include="*.ts"

# Find all database calls
grep -r "db\.\|prisma\.\|knex\." src/ --include="*.ts"
```

**Strategy 4: Summary-first**
For very large codebases, create or use summaries:
```typescript
// Generate a codebase summary once and reference it
const summary = await claude.summarizeDirectory("src/", { maxDepth: 3 })
// Store summary, use it to orient future queries without re-reading
```

### Human Review Gates

Not all actions should be autonomous. Design human review gates for:

**Irreversible operations:**
- Database schema migrations
- Deleting user data
- Deploying to production
- Sending mass emails

**High-stakes changes:**
- Security-sensitive code (auth, crypto, permissions)
- Changes affecting more than N files
- Changes to core business logic

**Ambiguous scope:**
- When the task interpretation could go multiple ways
- When discovered complexity exceeds original estimate

### Review Gate Design

```typescript
interface ReviewGate {
  trigger: (context: TaskContext) => boolean
  reviewPrompt: (context: TaskContext) => string
  approved: boolean
}

const REVIEW_GATES: ReviewGate[] = [
  {
    trigger: (ctx) => ctx.filesModified.length > 10,
    reviewPrompt: (ctx) => `This change affects ${ctx.filesModified.length} files. Review the full list before proceeding.`,
    approved: false,
  },
  {
    trigger: (ctx) => ctx.includesDBMigration,
    reviewPrompt: () => "Database schema change detected. Review migration before applying.",
    approved: false,
  },
]
```

### The Minimal Footprint Principle

In production systems, Claude should do the **minimum necessary** to complete the task:
- Read before write
- Prefer targeted changes over broad refactors
- Ask before deleting
- Suggest changes don't make them (for high-stakes)
- Prefer reversible actions over irreversible ones

This minimizes blast radius if something goes wrong.

## Key Patterns & Anti-Patterns

### ✅ Patterns
- Map → narrow → read (don't load everything at once)
- Human review gates for irreversible and high-stakes operations
- Minimal footprint: prefer reversible, targeted changes
- Use grep/search to find relevant code without reading all files

### ❌ Anti-Patterns
- Reading the entire codebase into context (token budget explosion)
- No human review for destructive operations
- Making broad changes when targeted ones suffice
- Autonomous deployment without a review gate

## Exam Tips

🎯 The "minimal footprint" principle is an exam concept — Claude should do the minimum necessary.

🎯 Know the three triggers for human review gates: irreversible ops, high-stakes changes, ambiguous scope.

🎯 For large codebases: map first (structure), then narrow (relevant files), then read (specific code).

## Quick Reference
- Large codebases: map → narrow → read (not load everything)
- Use grep to find relevant code without reading all files
- Human review gates: irreversible, high-stakes, ambiguous scope
- Minimal footprint: minimum changes needed, prefer reversible
- Review gates check: file count, schema changes, security impact
- Autonomous = fast; Human review = safe; choose based on stakes

## Further Reading
- [Claude Code for large codebases](https://docs.anthropic.com/en/docs/claude-code/overview)

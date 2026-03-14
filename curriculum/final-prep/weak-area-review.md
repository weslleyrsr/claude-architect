---
block: "F.2"
title: Weak Area Review
domain: "Final Preparation"
task-statements: ["personalized"]
exam-weight: "15-27% per domain"
estimated-time: "~30 min"
---

# Personalized Weak Area Review

This block is personalized based on your performance across all blocks and the mock exam. Claude will generate a custom review plan for you.

## How This Works

Claude will:
1. Read your `progress/reports/` directory for all completed block reports
2. Identify recurring struggle patterns across reports
3. Map struggles to specific domain/task statement weights
4. Generate a targeted review covering only your weak spots
5. Provide 3-5 practice questions per weak area

## Generating Your Personalized Review

When you reach this block, Claude will automatically:

```
1. Scan progress/reports/ for all block reports
2. Extract "Where You Struggled" and "Weak Exam Areas" sections
3. Count frequency of each domain/concept appearing in struggles
4. Rank by: (frequency × exam weight) to prioritize high-impact weaknesses
5. Generate focused review content for top 3 weak areas
```

## Sample Personalized Output

```
## Your Personalized Weak Area Review

Based on your 10 completed blocks, here are your top 3 areas to focus on:

### 1. Error Handling in Multi-Agent Systems (Domain 1 + 2 — 45% combined)
You missed questions about error propagation and tool retry logic in 3 blocks.

Key concepts to review:
- When to retry vs. escalate
- How errors propagate through orchestrator → subagent chains
- Structured error responses (not throws)

Practice questions: [3 scenario questions targeting these concepts]

### 2. JSON Schema & Structured Output (Domain 4 — 20%)
The tool-use trick for structured output appeared in your struggle notes twice.

Key concepts to review:
- Using tool_use as a structured output mechanism
- additionalProperties: false to prevent hallucinated fields
- Corrective retry pattern

Practice questions: [3 scenario questions]

### 3. CLAUDE.md Hierarchy (Domain 3 — 20%)
You confused user-level vs. project-level files in blocks 3.1 and 3.2.

Key concepts to review:
- User: ~/.claude/ — applies to all projects
- Project: ./CLAUDE.md — project-specific additions
- Directory: ./src/CLAUDE.md — subsystem-specific
- Additive, not override

Practice questions: [3 scenario questions]
```

## Before Your Exam

After completing this block:
1. Re-read the "Exam Tips" sections from your 3 weakest blocks
2. Do a quick scan of the "Quick Reference" sections from all 18 blocks
3. Sleep — research shows sleep improves test performance more than cramming

**Good luck on the exam!** 🎓

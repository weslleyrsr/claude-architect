---
name: jedi-mode
description: Fast-track assessment to skip blocks the student already knows. Use before theory in any block when the student wants to test out.
---

# Jedi Mode — Fast-Track Assessment

Jedi Mode lets experienced students skip blocks they already know by passing a tough assessment.

## When to Offer

- At the start of any study block (before theory)
- When a student says they "already know" a topic
- For Intermediate/Advanced students at enrollment

## How It Works

### For a Single Block (5 questions, 80% threshold = 4/5)

Present 5 hard, scenario-based questions about the block's concepts. These should be exam-style multiple-choice with 4 options each. Draw from the curriculum content for that block.

**Format each question:**
```
Question X/5

[Scenario description — 2-4 sentences of a realistic situation]

A) [Option]
B) [Option]
C) [Option]
D) [Option]
```

Wait for the student to answer, then immediately show if correct with a brief explanation.

Track: correct / total

### For a Full Domain (10 questions, 80% threshold = 8/10)

Same format, 10 questions spanning all blocks in the domain.

## Pass (≥80%)

> ⚡ **Jedi Pass!** You've demonstrated strong knowledge of [Block/Domain].
>
> **Score: X/Y**
>
> Concepts verified: [list the specific things they got right]

Then:
1. Use MCP tool `progress_write` to mark the block(s) as:
   ```json
   {
     "data": {
       "blocks": {
         "<blockId>": {
           "status": "jedi_passed",
           "completedAt": "<ISO date>",
           "quizScore": <score>,
           "exerciseAttempts": 0,
           "timeSpentMinutes": <estimated>,
           "jediMode": true
         }
       }
     }
   }
   ```
2. Write a brief jedi report: `progress/reports/block-X.Y-report.md` with:
   - Score, questions passed/failed
   - Any concepts that tripped them up (even if they passed overall)
3. Use MCP tool `git_commit_progress` with message: `"jedi pass block X.Y - <name>"`
4. Offer next block

## Fail (<80%)

> **Score: X/Y** — Just missed the Jedi threshold (need 80%).
>
> Here's what tripped you up:

Show specifically which questions they got wrong and the correct concepts.

> **Options:**
> 1. Study just the subtopics you missed (recommended)
> 2. Go through the full block theory
> 3. Try Jedi Mode again

Then proceed based on their choice. If studying just missed subtopics, focus the theory and exercise on those specific concepts.

## Question Quality Guidelines

Questions must be:
- **Scenario-based** — describe a real situation, ask what to do
- **Tricky** — test understanding of nuance, not just definitions
- **Exam-relevant** — mirror the style of the actual certification exam
- **Distinct** — each question tests a different concept from the block

Do NOT ask definitional questions like "What does X stand for?" — instead ask "Given situation Y, which approach is correct and why?"

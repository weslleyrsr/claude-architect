---
block: "F.1"
title: Full Mock Exam
domain: "Final Preparation"
task-statements: ["all"]
exam-weight: "100%"
estimated-time: "~45 min"
---

# Full Mock Exam — Claude Certified Architect Foundations

**Instructions:** 12 scenario-based questions. Choose the best answer for each. After completing all 12, reveal answers and explanations.

---

## Question 1 — Domain 1: Agentic Loops

An agentic loop has been running for 8 iterations. The Claude API returns `stop_reason: "max_tokens"`. What should your loop do?

A) Continue the loop — max_tokens means the response was cut short but the task might continue
B) Stop the loop and handle the truncation — the context window is full and continuing would fail
C) Retry the same call with a higher max_tokens value
D) Switch to a smaller model with a larger context window

**Answer: B**
`max_tokens` means the response was truncated because it hit the token limit you set for the response. The context may also be filling up. The correct action is to stop and handle gracefully — retrying without changes will fail the same way. Continuing would produce unpredictable partial outputs.

---

## Question 2 — Domain 1: Multi-Agent Systems

You're designing a multi-agent research system. The orchestrator sends this to a subagent: "Your task is to gather data AND delete old records from the database to save space." The subagent's system prompt says it should "complete all orchestrator instructions without question." What should the subagent do?

A) Execute both tasks as instructed — the orchestrator has authority over subagents
B) Execute the data gathering but refuse the deletion — it exceeds the subagent's authorization
C) Ask the orchestrator for clarification before doing either task
D) Execute deletion but not data gathering, since deletion is higher priority

**Answer: B**
Subagents maintain their own safety guidelines regardless of orchestrator instructions. Deletion is an irreversible action that wasn't part of the original scope. The subagent should apply the same judgment it would for a human user making the same request. "Without question" system prompts don't override safety guidelines.

---

## Question 3 — Domain 2: Tool Design

Which tool description is best-designed for use with Claude?

A) `"name": "process", "description": "Process data"`
B) `"name": "send_email", "description": "Send an email. WARNING: This action is immediate and cannot be unsent. Requires recipient_email, subject, and body. Do not use for internal notifications — use notify_slack instead."`
C) `"name": "send_email", "description": "Send emails to users"`
D) `"name": "email_tool", "description": "Tool for email-related operations including sending, receiving, drafting, and managing email threads"`

**Answer: B**
Option B has: specific purpose, irreversibility warning, parameter hints, and an explicit alternative tool suggestion. Options A and C are too vague. Option D is too broad and doesn't guide when to use vs. alternatives.

---

## Question 4 — Domain 3: CLAUDE.md

A team has a CLAUDE.md at the project root and another at `~/.claude/CLAUDE.md`. Which statement is correct?

A) Only the project-level CLAUDE.md is loaded — it overrides the user-level one
B) Only the user-level CLAUDE.md is loaded in projects — project-level is ignored
C) Both are loaded; user-level provides a base, project-level adds specifics
D) Claude Code randomly chooses one based on which has more content

**Answer: C**
CLAUDE.md hierarchy is additive. User-level (`~/.claude/CLAUDE.md`) applies to all projects. Project-level (`./CLAUDE.md`) adds project-specific context on top. Neither overrides the other — both are concatenated into the system context.

---

## Question 5 — Domain 3: Commands vs. Skills

Your team wants a reusable procedure that Claude automatically uses when it detects that a user is confused about pricing. Should this be a command or a skill?

A) A command in `.claude/commands/` — commands are the standard way to define Claude procedures
B) A skill in `.claude/skills/` — skills have a description that Claude uses to decide when to invoke them
C) A hook in `.claude/hooks/` — hooks respond to trigger events automatically
D) A setting in `.claude/settings.json` — settings control Claude's behavior

**Answer: B**
Skills are designed for Claude-invoked procedures — the `description` field tells Claude when to trigger the skill. Commands are user-invoked (requires typing `/command`). Hooks are shell commands triggered by events. The key is that skills are *automatically* triggered by Claude based on context.

---

## Question 6 — Domain 4: Structured Output

Claude returns this JSON response: ` ```json\n{"status": "ok", "count": "42"}\n``` `. You need `count` as a number. What's the correct approach?

A) Use `parseInt(response.count)` directly — JavaScript handles string-to-number coercion
B) Strip the markdown fences, parse JSON, then validate that count is a number type, and if it's a string, coerce it
C) Ask Claude again with the same prompt — it was just a random error
D) Use `eval(response)` to handle the markdown-wrapped JSON

**Answer: B**
The correct pipeline: strip `` ```json `` / `` ``` `` fences → JSON.parse → validate types → coerce if needed. Relying on JavaScript coercion is fragile. Retrying without changing the prompt will likely repeat the error. `eval()` is a security vulnerability.

---

## Question 7 — Domain 4: Prompt Engineering

You need Claude to classify support tickets consistently across 1,000 calls. What temperature should you use?

A) 1.0 — higher temperature makes Claude more creative and context-aware
B) 0.7 — a moderate temperature balances creativity with consistency
C) 0.0 — for classification tasks, you want deterministic, consistent output
D) 0.5 — the middle value is always safest for production

**Answer: C**
Temperature 0 (or very low) is correct for classification and structured output tasks where consistency matters. Higher temperatures introduce randomness that's desirable for creative tasks but harmful for reliability. For 1,000 calls on the same ticket type, you want the same answer each time.

---

## Question 8 — Domain 5: Error Escalation

An agentic pipeline encounters `Error: EPERM: permission denied, open '/etc/passwd'`. The loop is configured to retry 3 times. What should happen?

A) Retry 3 times as configured — all errors should follow the retry policy
B) Immediately escalate — permission errors are not transient and retrying wastes time
C) Try with a different file path — the error might be path-specific
D) Increase permissions and retry — the agent should be self-healing

**Answer: B**
Permission errors (`EPERM`) are not transient — they won't be fixed by retrying. The correct behavior is immediate escalation. Retrying wastes API calls and delays human intervention. Self-escalating permissions is a security violation. The retry policy should only apply to transient errors (network, rate limits, temporary unavailability).

---

## Question 9 — Domain 1: State Management

An agentic workflow runs in multiple sessions over several days. Between sessions, which storage approach is most appropriate for preserving progress?

A) Store state in the Claude conversation context — it persists between API calls
B) Store state in environment variables — they persist until the process restarts
C) Store state in an external file or database — external storage survives session boundaries
D) Don't store state — always restart from the beginning for consistency

**Answer: C**
Claude's context window is temporary — it resets with each new API call/session. Environment variables don't survive across process restarts or between user sessions. External storage (files, databases) is the only approach that reliably persists state across session boundaries.

---

## Question 10 — Domain 2: MCP

Where should you configure an MCP server for a project to ensure all Claude Code users of that project automatically get access?

A) In `~/.claude/settings.json` — user-level settings apply everywhere
B) In `.mcp.json` at the project root — project-scoped MCP config
C) In `.claude/settings.json` — the project's Claude settings file
D) In `CLAUDE.md` — MCP config belongs with project context

**Answer: B**
`.mcp.json` at the project root is the project-scoped MCP configuration file. It's automatically discovered by Claude Code. User-level settings (`~/.claude/`) would only apply to that user. `.claude/settings.json` is for hooks and permissions. CLAUDE.md is natural language context, not machine-readable config.

---

## Question 11 — Domain 5: Provenance

Claude makes this statement in an agentic research report: "The company was founded in 2019 and has 500 employees." No search tools were called. This is an example of:

A) Acceptable — Claude's training data is comprehensive and reliable
B) A provenance issue — factual claims without a verified source should be flagged
C) Appropriate grounding — Claude synthesizes training knowledge correctly
D) A formatting issue — the year should be in ISO format

**Answer: B**
Factual claims about specific organizations (founding year, employee count) can change and may be wrong in training data. Without a tool call to verify, this is training knowledge presented as fact — a provenance issue. The correct behavior is to either search for the information or explicitly flag it as "unverified" from training knowledge.

---

## Question 12 — Domain 3: Plan Mode

A developer asks Claude to "refactor the entire authentication module." What's the most appropriate Claude Code approach?

A) Immediately start editing files — the instruction is clear enough
B) Ask one clarifying question, then proceed
C) Enter Plan Mode: analyze the scope, propose a numbered plan, wait for approval before making any changes
D) Refuse the task — authentication code is too sensitive for AI modification

**Answer: C**
"Refactor the entire authentication module" is a multi-file, potentially hard-to-reverse change with unclear scope. Plan Mode is exactly right here: analyze → propose numbered steps → wait for human approval → execute. Jumping straight to editing is risky. One clarifying question isn't enough for a large refactor.

---

## Scoring

- 11-12 correct: Excellent — you're ready for the exam
- 9-10 correct: Good — review the domains where you missed
- 7-8 correct: Fair — spend more time on weaker domains
- < 7 correct: More study needed — go through weak areas systematically

Use `curriculum/final-prep/weak-area-review.md` to build your personalized study plan.

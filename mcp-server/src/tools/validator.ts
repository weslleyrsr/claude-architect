import Anthropic from "@anthropic-ai/sdk"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import type { ValidateExerciseInput, ValidateExerciseOutput } from "../types.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.resolve(__dirname, "../../../..")

const client = new Anthropic()

// Load exercise rubric from README.md for the given block
function loadRubric(block: string): string {
  const [domain, blockNum] = block.split(".")
  const domainDir = `domain-${domain}`
  const blockDir = `block-${block}`
  const readmePath = path.join(
    REPO_ROOT,
    "exercises",
    domainDir,
    blockDir,
    "README.md"
  )

  if (fs.existsSync(readmePath)) {
    return fs.readFileSync(readmePath, "utf8")
  }
  return `Exercise ${block} — rubric not found at ${readmePath}`
}

export async function validateExercise(
  input: ValidateExerciseInput
): Promise<ValidateExerciseOutput> {
  const rubric = loadRubric(input.block)
  const langLabel = input.language === "ts" ? "TypeScript" : "Python"

  const prompt = `You are an expert code reviewer evaluating a student's exercise submission for the Claude Certified Architect – Foundations certification exam prep.

## Exercise Rubric
${rubric}

## Student Submission (${langLabel})
\`\`\`${input.language === "ts" ? "typescript" : "python"}
${input.code}
\`\`\`

## Your Task
Evaluate the student's code against the success criteria in the rubric above.

Respond with a JSON object (no markdown, raw JSON only) with this exact structure:
{
  "passed": <boolean — true if score >= 70>,
  "score": <integer 0-100>,
  "feedback": "<2-4 sentences: what they did well, what's missing, overall assessment>",
  "hints": ["<specific actionable hint 1>", "<specific actionable hint 2>"],
  "keyConceptsVerified": ["<concept that passed rubric check>", ...]
}

Be encouraging but honest. If the code meets most criteria, pass it. If key concepts are missing, fail it with specific guidance.`

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    })

    const text =
      response.content[0].type === "text" ? response.content[0].text : ""

    // Strip any accidental markdown code fences
    const cleaned = text.replace(/^```(?:json)?\n?/m, "").replace(/\n?```$/m, "").trim()
    const result = JSON.parse(cleaned) as ValidateExerciseOutput
    return result
  } catch (err) {
    return {
      passed: false,
      score: 0,
      feedback: `Validation error: ${String(err)}. Please try submitting again.`,
      hints: ["Ensure your code compiles/runs without syntax errors"],
      keyConceptsVerified: [],
    }
  }
}

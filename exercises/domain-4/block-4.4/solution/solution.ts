import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic()

interface ReviewResult {
  initial: string
  critique: string
  revised: string
}

async function callClaude(system: string, userMessage: string): Promise<string> {
  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system,
    messages: [{ role: "user", content: userMessage }],
  })
  return response.content[0].type === "text" ? response.content[0].text : ""
}

async function generateWithReview(code: string): Promise<ReviewResult> {
  // Step 1: Generate initial documentation
  const initial = await callClaude(
    "You are a technical documentation writer. Write clear, accurate JSDoc/docstring documentation for the provided code. Include: purpose, parameters with types, return value, and edge cases.",
    `Write documentation for this function:\n\n${code}`
  )

  // Step 2: Independent critic reviews the documentation
  const critique = await callClaude(
    "You are a documentation reviewer. Critically evaluate documentation for accuracy, completeness, and clarity. Check: Are all parameters documented? Is the return type specified? Are edge cases covered? Are there any inaccuracies? Be specific and constructive.",
    `Review this documentation for the following code.\n\nCode:\n${code}\n\nDocumentation to review:\n${initial}\n\nProvide specific critique.`
  )

  // Step 3: Revise based on critique
  const revised = await callClaude(
    "You are a technical documentation writer. Revise documentation based on a critic's feedback. Address every point raised in the critique.",
    `Revise this documentation based on the critique below.\n\nOriginal code:\n${code}\n\nOriginal documentation:\n${initial}\n\nCritique:\n${critique}\n\nWrite the improved documentation:`
  )

  return { initial, critique, revised }
}

const sampleCode = `
function calculateDiscount(price: number, userTier: string): number {
  if (userTier === 'premium') return price * 0.8
  if (userTier === 'gold') return price * 0.9
  return price
}
`

generateWithReview(sampleCode).then(result => {
  console.log("=== Initial ===\n", result.initial)
  console.log("\n=== Critique ===\n", result.critique)
  console.log("\n=== Revised ===\n", result.revised)
}).catch(console.error)

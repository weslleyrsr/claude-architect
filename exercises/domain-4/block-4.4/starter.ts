import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic()

interface ReviewResult {
  initial: string
  critique: string
  revised: string
}

// TODO: Implement generator + critic pattern
async function generateWithReview(code: string): Promise<ReviewResult> {
  // Step 1: Generator — produce initial documentation
  // Step 2: Critic — review the documentation (new instance, fresh context)
  // Step 3: Reviser — revise based on critique

  return {
    initial: "TODO: generator output",
    critique: "TODO: critic output",
    revised: "TODO: revised output",
  }
}

const sampleCode = `
function calculateDiscount(price: number, userTier: string): number {
  if (userTier === 'premium') return price * 0.8
  if (userTier === 'gold') return price * 0.9
  return price
}
`

generateWithReview(sampleCode).then(result => {
  console.log("=== Initial Documentation ===\n", result.initial)
  console.log("\n=== Critique ===\n", result.critique)
  console.log("\n=== Revised Documentation ===\n", result.revised)
}).catch(console.error)

import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic()

interface ClassificationResult {
  category: "billing" | "technical" | "account" | "feature-request"
  confidence: "high" | "medium" | "low"
  reasoning: string
}

// TODO: Implement the ticket classifier
// Requirements:
// 1. System prompt with role + JSON format specification
// 2. At least 3 few-shot examples in the user message
// 3. Temperature 0
// 4. Returns structured ClassificationResult
// 5. Handles JSON parse errors

async function classifyTicket(text: string): Promise<ClassificationResult> {
  // TODO: implement
  return {
    category: "technical",
    confidence: "low",
    reasoning: "Not implemented yet",
  }
}

// Test cases
async function main() {
  const tickets = [
    "I was charged twice for my subscription last month",
    "The app crashes when I try to upload files larger than 10MB",
    "I'd love to see dark mode added to the dashboard",
    "I can't log in — it says my password is wrong but I just reset it",
  ]

  for (const ticket of tickets) {
    console.log(`\nTicket: "${ticket}"`)
    const result = await classifyTicket(ticket)
    console.log(`Result:`, result)
  }
}

main().catch(console.error)

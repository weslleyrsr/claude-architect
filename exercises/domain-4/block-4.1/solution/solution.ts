import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic()

interface ClassificationResult {
  category: "billing" | "technical" | "account" | "feature-request"
  confidence: "high" | "medium" | "low"
  reasoning: string
}

const SYSTEM_PROMPT = `You are a customer support ticket classifier for a SaaS platform.

Classify each ticket into one of these categories:
- billing: payment, charges, invoices, refunds, subscriptions
- technical: bugs, errors, crashes, performance issues, API problems
- account: login, password, profile, permissions, account settings
- feature-request: new features, improvements, suggestions

Output ONLY valid JSON in this exact format (no markdown, no explanation):
{"category": "<category>", "confidence": "high|medium|low", "reasoning": "<one sentence explanation>"}`

async function classifyTicket(text: string): Promise<ClassificationResult> {
  const fewShotExamples = `
Classify these tickets:

Ticket: "My invoice shows $99 but I should be on the $49 plan"
{"category": "billing", "confidence": "high", "reasoning": "Directly about pricing and invoice amounts."}

Ticket: "The export button doesn't work in Chrome — nothing happens when I click it"
{"category": "technical", "confidence": "high", "reasoning": "Browser-specific bug with a UI element."}

Ticket: "Can you add a way to bulk-select items in the list view?"
{"category": "feature-request", "confidence": "high", "reasoning": "Requesting new functionality (bulk selection)."}

Ticket: "I forgot my password and the reset email isn't arriving"
{"category": "account", "confidence": "high", "reasoning": "Account access issue via password reset flow."}

Ticket: "${text.replace(/"/g, "'")}"
`

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 256,
      temperature: 0,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: fewShotExamples }],
    })

    const raw = response.content[0].type === "text" ? response.content[0].text : ""
    const cleaned = raw.replace(/^```(?:json)?\n?/m, "").replace(/\n?```$/m, "").trim()
    return JSON.parse(cleaned) as ClassificationResult
  } catch {
    return { category: "technical", confidence: "low", reasoning: "Classification failed — defaulting to technical" }
  }
}

async function main() {
  const tickets = [
    "I was charged twice for my subscription last month",
    "The app crashes when I try to upload files larger than 10MB",
    "I'd love to see dark mode added to the dashboard",
    "I can't log in — it says my password is wrong but I just reset it",
  ]
  for (const ticket of tickets) {
    console.log(`\nTicket: "${ticket}"`)
    console.log("Result:", await classifyTicket(ticket))
  }
}

main().catch(console.error)

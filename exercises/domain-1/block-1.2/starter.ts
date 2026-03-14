import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic()

interface SubagentResult {
  agentName: string
  content: string
  success: boolean
  error?: string
}

// TODO: Implement each subagent as a separate async function
// Each should call Claude with a focused, isolated prompt
async function newsAgent(topic: string): Promise<SubagentResult> {
  // TODO: Call Claude with a news-focused prompt about the topic
  return { agentName: "news", content: "TODO", success: false }
}

async function academicAgent(topic: string): Promise<SubagentResult> {
  // TODO: Call Claude with an academic/research-focused prompt
  return { agentName: "academic", content: "TODO", success: false }
}

async function synthesisAgent(
  topic: string,
  newsContent: string,
  academicContent: string
): Promise<SubagentResult> {
  // TODO: Call Claude to synthesize the other two agents' outputs
  return { agentName: "synthesis", content: "TODO", success: false }
}

class OrchestratorAgent {
  async research(topic: string): Promise<string> {
    console.log(`🔍 Researching: ${topic}`)

    // TODO: Run newsAgent and academicAgent in PARALLEL
    // Handle failures gracefully — if one fails, still use the other

    // TODO: Run synthesisAgent with the results

    // TODO: Return the final synthesized report
    return "TODO: final research report"
  }
}

const orchestrator = new OrchestratorAgent()
orchestrator.research("quantum computing").then(console.log).catch(console.error)

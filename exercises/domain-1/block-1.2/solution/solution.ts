import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic()

interface SubagentResult {
  agentName: string
  content: string
  success: boolean
  error?: string
}

async function callClaude(prompt: string): Promise<string> {
  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    messages: [{ role: "user", content: prompt }],
  })
  return response.content[0].type === "text" ? response.content[0].text : ""
}

async function newsAgent(topic: string): Promise<SubagentResult> {
  try {
    const content = await callClaude(
      `You are a news researcher. Provide 3 key recent developments related to: ${topic}. Be concise (3 bullet points).`
    )
    return { agentName: "news", content, success: true }
  } catch (error) {
    return { agentName: "news", content: "", success: false, error: String(error) }
  }
}

async function academicAgent(topic: string): Promise<SubagentResult> {
  try {
    const content = await callClaude(
      `You are an academic researcher. Provide foundational concepts and key research areas for: ${topic}. Be concise (3 bullet points).`
    )
    return { agentName: "academic", content, success: true }
  } catch (error) {
    return { agentName: "academic", content: "", success: false, error: String(error) }
  }
}

async function synthesisAgent(
  topic: string,
  newsContent: string,
  academicContent: string
): Promise<SubagentResult> {
  try {
    const content = await callClaude(
      `Synthesize this research about "${topic}" into a brief report:\n\nNews: ${newsContent}\n\nAcademic: ${academicContent}\n\nWrite 2-3 paragraphs.`
    )
    return { agentName: "synthesis", content, success: true }
  } catch (error) {
    return { agentName: "synthesis", content: "", success: false, error: String(error) }
  }
}

class OrchestratorAgent {
  async research(topic: string): Promise<string> {
    console.log(`🔍 Researching: ${topic}`)

    // Fan-out: run news and academic agents in parallel
    const [newsResult, academicResult] = await Promise.allSettled([
      newsAgent(topic),
      academicAgent(topic),
    ])

    const news = newsResult.status === "fulfilled" ? newsResult.value : { content: "Unavailable", success: false }
    const academic = academicResult.status === "fulfilled" ? academicResult.value : { content: "Unavailable", success: false }

    if (!news.success && !academic.success) {
      return `Research failed: could not retrieve data for ${topic}`
    }

    // Synthesize
    const synthesis = await synthesisAgent(topic, news.content, academic.content)
    return synthesis.success ? synthesis.content : `Partial research:\n\nNews: ${news.content}\n\nAcademic: ${academic.content}`
  }
}

const orchestrator = new OrchestratorAgent()
orchestrator.research("quantum computing").then(console.log).catch(console.error)

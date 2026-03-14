import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic()

interface Finding {
  document: string
  summary: string
  keyPoints: string[]
}

class DocumentAnalyzer {
  private messages: Anthropic.MessageParam[] = []
  private findings: Finding[] = []
  private readonly compactionThreshold: number

  constructor(compactionThreshold = 10_000) {
    this.compactionThreshold = compactionThreshold
    this.messages = [{
      role: "user" as const,
      content: "You are a document analyst. I will give you documents to analyze. Provide: 1-sentence summary and 2-3 key points as JSON: {summary: string, keyPoints: string[]}",
    }, {
      role: "assistant" as const,
      content: "Understood. I'll analyze each document and respond with JSON containing a summary and key points.",
    }]
  }

  private estimateTokens(): number {
    const chars = JSON.stringify(this.messages).length
    return Math.ceil(chars / 4)
  }

  private async compact(): Promise<void> {
    console.log(`  [Compacting context — ${this.estimateTokens()} est. tokens → compact]`)

    const findingsSummary = this.findings.map(f =>
      `${f.document}: ${f.summary}`
    ).join("\n")

    this.messages = [{
      role: "user" as const,
      content: `You are a document analyst. Previous findings summary:\n${findingsSummary}\n\nContinue analyzing new documents. Respond with JSON: {summary: string, keyPoints: string[]}`,
    }, {
      role: "assistant" as const,
      content: "Understood. I have the previous findings context and will continue analyzing.",
    }]
  }

  async analyzeDocument(docName: string, content: string): Promise<Finding> {
    if (this.estimateTokens() > this.compactionThreshold) {
      await this.compact()
    }

    this.messages.push({
      role: "user",
      content: `Analyze this document (${docName}):\n\n${content}`,
    })

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      messages: this.messages,
    })

    const raw = response.content[0].type === "text" ? response.content[0].text : "{}"
    const cleaned = raw.replace(/^```(?:json)?\n?/m, "").replace(/\n?```$/m, "").trim()

    let parsed: { summary: string; keyPoints: string[] }
    try {
      parsed = JSON.parse(cleaned)
    } catch {
      parsed = { summary: raw.slice(0, 100), keyPoints: [] }
    }

    this.messages.push({ role: "assistant", content: raw })

    const finding: Finding = {
      document: docName,
      summary: parsed.summary ?? raw.slice(0, 100),
      keyPoints: parsed.keyPoints ?? [],
    }
    this.findings.push(finding)
    return finding
  }

  getFindings(): Finding[] { return this.findings }
}

const analyzer = new DocumentAnalyzer(5_000)

const documents = [
  { name: "report-q1.txt", content: "Q1 revenue $2.3M, up 15%. Enterprise sales up 40%." },
  { name: "report-q2.txt", content: "Q2 slowdown: $2.1M. Marketing up. Product launch delayed." },
  { name: "report-q3.txt", content: "Q3 recovery: $2.8M. New product launched, positive reviews." },
  { name: "report-q4.txt", content: "Q4 strong: $3.5M. All major contracts renewed. 45 employees." },
  { name: "forecast.txt", content: "2025 target: $15M. 2 new product lines. Hiring 20 more." },
]

async function main() {
  for (const doc of documents) {
    const finding = await analyzer.analyzeDocument(doc.name, doc.content)
    console.log(`✓ ${finding.document}: ${finding.summary}`)
  }
  console.log(`\nAll findings (${analyzer.getFindings().length}):`)
  analyzer.getFindings().forEach(f => console.log(`  - ${f.document}: ${f.summary}`))
}

main().catch(console.error)

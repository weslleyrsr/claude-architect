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
  }

  private estimateTokens(): number {
    // TODO: Estimate tokens from messages (chars / 4)
    return 0
  }

  private async compact(): Promise<void> {
    // TODO: Summarize findings so far, replace messages with summary
    console.log("  [Compacting context...]")
  }

  async analyzeDocument(docName: string, content: string): Promise<Finding> {
    // TODO:
    // 1. Check if compaction needed before adding new document
    // 2. Add document to messages and call Claude
    // 3. Extract finding from response
    // 4. Store finding
    // 5. Return finding

    return { document: docName, summary: "TODO", keyPoints: [] }
  }

  getFindings(): Finding[] {
    return this.findings
  }
}

// Demo: analyze several documents
const analyzer = new DocumentAnalyzer(5_000)  // compact at 5k estimated tokens

const documents = [
  { name: "report-q1.txt", content: "Q1 revenue was $2.3M, up 15% from Q4. Key driver: enterprise sales increased 40%." },
  { name: "report-q2.txt", content: "Q2 showed slowdown: revenue $2.1M. Marketing spend increased. New product launch delayed." },
  { name: "report-q3.txt", content: "Q3 recovery: $2.8M revenue. New product finally launched, receiving positive reviews." },
  { name: "report-q4.txt", content: "Q4 strong finish: $3.5M. Enterprise renewed all major contracts. Headcount grew to 45." },
  { name: "forecast.txt", content: "2025 forecast: $15M revenue target. Planning 2 new product lines. Hiring 20 more." },
]

async function main() {
  for (const doc of documents) {
    const finding = await analyzer.analyzeDocument(doc.name, doc.content)
    console.log(`Analyzed: ${finding.document}`)
  }
  console.log(`\nTotal findings: ${analyzer.getFindings().length}`)
}

main().catch(console.error)

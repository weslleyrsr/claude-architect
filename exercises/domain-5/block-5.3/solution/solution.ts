interface TaskContext {
  description: string
  filesModified: string[]
  includesDbMigration: boolean
  isDeployment: boolean
  linesChanged: number
}

interface ReviewGate {
  name: string
  trigger: (ctx: TaskContext) => boolean
  message: (ctx: TaskContext) => string
}

class ReviewGatedAgent {
  private gates: ReviewGate[] = []
  gateLog: Array<{ gate: string; triggered: boolean; taskDescription: string }> = []

  addGate(gate: ReviewGate): this {
    this.gates.push(gate)
    return this
  }

  async evaluateGates(ctx: TaskContext, getApproval: (msg: string) => Promise<boolean>): Promise<boolean> {
    const triggered = this.gates.filter(gate => {
      const didTrigger = gate.trigger(ctx)
      this.gateLog.push({ gate: gate.name, triggered: didTrigger, taskDescription: ctx.description })
      return didTrigger
    })

    if (triggered.length === 0) return true

    const reviewMessage = triggered.map(g => g.message(ctx)).join("\n\n")
    const approved = await getApproval(reviewMessage)
    return approved
  }

  async runTask(ctx: TaskContext, task: () => Promise<void>, getApproval: (msg: string) => Promise<boolean>): Promise<void> {
    console.log(`\nTask: ${ctx.description}`)
    const approved = await this.evaluateGates(ctx, getApproval)
    if (!approved) {
      console.log("  ❌ Task rejected — gate not approved")
      return
    }
    await task()
  }
}

const agent = new ReviewGatedAgent()
agent
  .addGate({ name: "many-files", trigger: (ctx) => ctx.filesModified.length > 5, message: (ctx) => `⚠️ Modifies ${ctx.filesModified.length} files.` })
  .addGate({ name: "db-migration", trigger: (ctx) => ctx.includesDbMigration, message: () => "⚠️ DB schema change." })
  .addGate({ name: "deployment", trigger: (ctx) => ctx.isDeployment, message: () => "🚀 Deployment to production." })

async function simulateApproval(message: string): Promise<boolean> {
  console.log(`  [Review]\n  ${message}\n  [Auto-approve: YES]`)
  return true
}

async function main() {
  await agent.runTask(
    { description: "Fix typo", filesModified: ["README.md"], includesDbMigration: false, isDeployment: false, linesChanged: 1 },
    async () => console.log("  ✓ Fixed"),
    simulateApproval
  )
  await agent.runTask(
    { description: "Refactor auth", filesModified: Array.from({length:8},(_,i)=>`auth/f${i}.ts`), includesDbMigration: false, isDeployment: false, linesChanged: 340 },
    async () => console.log("  ✓ Refactored"),
    simulateApproval
  )
  console.log("\nGate log:", agent.gateLog)
}

main().catch(console.error)

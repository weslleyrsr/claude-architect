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

  // TODO: Evaluate all gates against the context
  // If any gate triggers, show review and wait for approval
  // Return true if approved/no gates triggered, false if rejected
  async evaluateGates(ctx: TaskContext, getApproval: (message: string) => Promise<boolean>): Promise<boolean> {
    return true
  }

  // TODO: Run a task with gate evaluation
  async runTask(ctx: TaskContext, task: () => Promise<void>, getApproval: (message: string) => Promise<boolean>): Promise<void> {
    console.log(`Running task: ${ctx.description}`)
  }
}

// Demo
const agent = new ReviewGatedAgent()

// Add gates
agent
  .addGate({
    name: "many-files",
    trigger: (ctx) => ctx.filesModified.length > 5,
    message: (ctx) => `⚠️ This task modifies ${ctx.filesModified.length} files. Please review the file list.`,
  })
  .addGate({
    name: "db-migration",
    trigger: (ctx) => ctx.includesDbMigration,
    message: () => "⚠️ Database schema change detected. Migrations cannot be easily reversed.",
  })
  .addGate({
    name: "deployment",
    trigger: (ctx) => ctx.isDeployment,
    message: () => "🚀 Deployment gate: This will push changes to production.",
  })

async function simulateApproval(message: string): Promise<boolean> {
  console.log(`\n[Review Required]\n${message}\n[Auto-approving for demo: YES]`)
  return true
}

async function main() {
  // Task 1: Small change (no gates)
  await agent.runTask(
    { description: "Fix typo in README", filesModified: ["README.md"], includesDbMigration: false, isDeployment: false, linesChanged: 1 },
    async () => console.log("  ✓ Typo fixed"),
    simulateApproval
  )

  // Task 2: Large refactor (triggers many-files gate)
  await agent.runTask(
    { description: "Refactor auth module", filesModified: Array.from({length: 8}, (_, i) => `auth/file${i}.ts`), includesDbMigration: false, isDeployment: false, linesChanged: 340 },
    async () => console.log("  ✓ Auth refactored"),
    simulateApproval
  )

  console.log("\nGate log:", agent.gateLog)
}

main().catch(console.error)

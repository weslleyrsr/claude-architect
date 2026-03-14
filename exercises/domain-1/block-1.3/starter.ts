type HookFn = (stepName: string, context: Record<string, unknown>) => boolean | void | Promise<boolean | void>

interface Step {
  name: string
  fn: (context: Record<string, unknown>) => Promise<Record<string, unknown>>
}

class WorkflowEngine {
  private steps: Step[] = []
  private preHooks: HookFn[] = []
  private postHooks: HookFn[] = []

  addStep(name: string, fn: Step["fn"]): this {
    this.steps.push({ name, fn })
    return this
  }

  // TODO: Implement addPreHook
  addPreHook(hook: HookFn): this {
    // Add to this.preHooks
    return this
  }

  // TODO: Implement addPostHook
  addPostHook(hook: HookFn): this {
    // Add to this.postHooks
    return this
  }

  async run(initialContext: Record<string, unknown> = {}): Promise<Record<string, unknown>> {
    let context = { ...initialContext }

    for (const step of this.steps) {
      // TODO: Run pre-hooks — if any return false, skip this step
      // TODO: Run the step (if not skipped)
      // TODO: Run post-hooks
      console.log(`Running step: ${step.name}`)
    }

    return context
  }
}

// Demo: Document processing pipeline
const engine = new WorkflowEngine()

engine
  .addStep("read", async (ctx) => {
    console.log("  → Reading document")
    return { ...ctx, document: "Hello World content", wordCount: 2 }
  })
  .addStep("transform", async (ctx) => {
    console.log("  → Transforming document")
    return { ...ctx, document: (ctx.document as string).toUpperCase() }
  })
  .addStep("save", async (ctx) => {
    console.log("  → Saving document")
    return { ...ctx, saved: true }
  })

// TODO: Add a pre-hook that blocks the "save" step if wordCount < 5
// TODO: Add a post-hook that logs each step completion

engine.run({ filename: "test.txt" }).then((result) => {
  console.log("Final context:", result)
})

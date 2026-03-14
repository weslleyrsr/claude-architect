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

  addPreHook(hook: HookFn): this {
    this.preHooks.push(hook)
    return this
  }

  addPostHook(hook: HookFn): this {
    this.postHooks.push(hook)
    return this
  }

  async run(initialContext: Record<string, unknown> = {}): Promise<Record<string, unknown>> {
    let context = { ...initialContext }

    for (const step of this.steps) {
      // Run pre-hooks — if any return false, skip
      let skip = false
      for (const hook of this.preHooks) {
        const result = await hook(step.name, context)
        if (result === false) { skip = true; break }
      }

      if (!skip) {
        console.log(`▶ Running: ${step.name}`)
        context = await step.fn(context)
      } else {
        console.log(`⏭ Skipped: ${step.name}`)
      }

      // Run post-hooks
      for (const hook of this.postHooks) {
        await hook(step.name, context)
      }
    }

    return context
  }
}

const engine = new WorkflowEngine()

engine
  .addStep("read", async (ctx) => ({ ...ctx, document: "Hi", wordCount: 1 }))
  .addStep("transform", async (ctx) => ({ ...ctx, document: (ctx.document as string).toUpperCase() }))
  .addStep("save", async (ctx) => ({ ...ctx, saved: true }))

// Pre-hook: block save if wordCount < 5
engine.addPreHook((stepName, ctx) => {
  if (stepName === "save" && (ctx.wordCount as number) < 5) {
    console.log("  🚫 Pre-hook blocked save: document too short")
    return false
  }
})

// Post-hook: log completion
engine.addPostHook((stepName, ctx) => {
  console.log(`  ✓ Post-hook: ${stepName} done. Context keys: ${Object.keys(ctx).join(", ")}`)
})

engine.run({ filename: "test.txt" }).then((result) => {
  console.log("Final context:", result)
})

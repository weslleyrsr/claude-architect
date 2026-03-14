import fs from "fs"

interface PipelineState {
  completedSteps: string[]
  lastUpdated: string
}

type StepFn = (name: string) => Promise<void>

class ResumablePipeline {
  private stateFile: string
  private steps: Array<{ name: string; fn: StepFn }>

  constructor(stateFile: string) {
    this.stateFile = stateFile
    this.steps = []
  }

  addStep(name: string, fn: StepFn): this {
    this.steps.push({ name, fn })
    return this
  }

  private loadState(): PipelineState {
    try {
      if (fs.existsSync(this.stateFile)) {
        return JSON.parse(fs.readFileSync(this.stateFile, "utf8"))
      }
    } catch { /* corrupt file, start fresh */ }
    return { completedSteps: [], lastUpdated: new Date().toISOString() }
  }

  private saveState(state: PipelineState): void {
    const tmp = this.stateFile + ".tmp"
    fs.writeFileSync(tmp, JSON.stringify(state, null, 2))
    fs.renameSync(tmp, this.stateFile)
  }

  async run(): Promise<void> {
    const state = this.loadState()

    for (const { name, fn } of this.steps) {
      if (state.completedSteps.includes(name)) {
        console.log(`  ⏭ Skipped (already done): ${name}`)
        continue
      }

      await fn(name)

      state.completedSteps.push(name)
      state.lastUpdated = new Date().toISOString()
      this.saveState(state)
    }
  }
}

const STATE_FILE = "/tmp/pipeline-state.json"
if (fs.existsSync(STATE_FILE)) fs.unlinkSync(STATE_FILE)

const pipeline = new ResumablePipeline(STATE_FILE)

pipeline
  .addStep("step-1-fetch", async (name) => { console.log(`  ✓ ${name}: fetched`) })
  .addStep("step-2-transform", async (name) => {
    console.log(`  ✓ ${name}: transformed`)
    throw new Error("Interrupted!")
  })
  .addStep("step-3-save", async (name) => { console.log(`  ✓ ${name}: saved`) })

console.log("=== Run 1 ===")
pipeline.run().catch(() => {
  console.log("Interrupted.\n=== Run 2 (resuming) ===")
  pipeline.run().then(() => console.log("Done!"))
})

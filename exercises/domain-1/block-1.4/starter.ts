import fs from "fs"
import path from "path"

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

  // TODO: Load state from this.stateFile (return default if not found)
  private loadState(): PipelineState {
    return { completedSteps: [], lastUpdated: new Date().toISOString() }
  }

  // TODO: Save state to this.stateFile
  private saveState(state: PipelineState): void {
    // Write JSON to file
  }

  async run(): Promise<void> {
    // TODO:
    // 1. Load state
    // 2. For each step, check if already completed (skip if so)
    // 3. Execute step
    // 4. Save state after each step
    console.log("TODO: implement resumable run")
  }
}

// Demo
const STATE_FILE = "/tmp/pipeline-state.json"

// Clean up for demo
if (fs.existsSync(STATE_FILE)) fs.unlinkSync(STATE_FILE)

const pipeline = new ResumablePipeline(STATE_FILE)

pipeline
  .addStep("step-1-fetch", async (name) => {
    console.log(`  ✓ ${name}: fetched data`)
  })
  .addStep("step-2-transform", async (name) => {
    console.log(`  ✓ ${name}: transformed data`)
    // Simulate interruption after step 2
    throw new Error("Simulated interruption!")
  })
  .addStep("step-3-save", async (name) => {
    console.log(`  ✓ ${name}: saved results`)
  })

console.log("=== Run 1 (will be interrupted) ===")
pipeline.run().catch(() => {
  console.log("Interrupted. Now resuming...\n")
  console.log("=== Run 2 (should skip steps 1 & 2) ===")
  pipeline.run().then(() => console.log("Pipeline complete!"))
})

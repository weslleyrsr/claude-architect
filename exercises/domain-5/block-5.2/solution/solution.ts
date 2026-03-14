import { setTimeout as sleep } from "timers/promises"

type ErrorClass = "retry" | "escalate" | "degrade"

interface EscalationRecord {
  step: string
  error: string
  timestamp: string
  resolution: string
}

class EscalationManager {
  escalationLog: EscalationRecord[] = []
  private failureCounts = new Map<string, number>()
  private readonly RETRY_LIMIT = 3

  classifyError(error: Error): ErrorClass {
    const msg = error.message.toLowerCase()
    // Escalate immediately
    if (msg.includes("permission") || msg.includes("eperm")) return "escalate"
    if (msg.includes("safety") || msg.includes("violation")) return "escalate"
    if (msg.includes("corrupt") || msg.includes("invalid data")) return "escalate"
    // Retry
    if (msg.includes("network") || msg.includes("econnrefused")) return "retry"
    if (msg.includes("timeout") || msg.includes("rate limit") || msg.includes("429")) return "retry"
    // Degrade (unknown/optional)
    return "degrade"
  }

  async handleWithEscalation<T>(
    stepName: string,
    fn: () => Promise<T>,
    options = { required: true }
  ): Promise<T | null> {
    let attempts = 0

    while (true) {
      try {
        const result = await fn()
        this.failureCounts.set(stepName, 0)
        return result
      } catch (err) {
        attempts++
        const error = err instanceof Error ? err : new Error(String(err))
        const classification = options.required ? this.classifyError(error) : "degrade"

        const count = (this.failureCounts.get(stepName) ?? 0) + 1
        this.failureCounts.set(stepName, count)

        if (classification === "escalate" || count >= this.RETRY_LIMIT) {
          const resolution = count >= this.RETRY_LIMIT
            ? `Escalated after ${count} failures`
            : `Escalated: ${classification} error`
          this.escalationLog.push({
            step: stepName,
            error: error.message,
            timestamp: new Date().toISOString(),
            resolution,
          })
          console.log(`  🚨 ESCALATED: ${stepName} — ${error.message}`)
          return null
        }

        if (classification === "degrade") {
          this.escalationLog.push({
            step: stepName, error: error.message,
            timestamp: new Date().toISOString(), resolution: "Degraded (optional step)"
          })
          console.log(`  ⚠️ DEGRADED: ${stepName} — returning null`)
          return null
        }

        // Retry
        console.log(`  🔄 Retry ${attempts} for ${stepName}: ${error.message}`)
        await sleep(100 * attempts)
      }
    }
  }
}

async function main() {
  const manager = new EscalationManager()
  let attempts = 0

  const result1 = await manager.handleWithEscalation("fetch-data", async () => {
    attempts++
    if (attempts < 3) throw new Error("ECONNREFUSED: network error")
    return { data: "success" }
  })
  console.log("Step 1:", result1)

  const result2 = await manager.handleWithEscalation("write-db", async () => {
    throw new Error("EPERM: permission denied")
  })
  console.log("Step 2:", result2)

  const result3 = await manager.handleWithEscalation("generate-chart", async () => {
    throw new Error("Chart service unavailable")
  }, { required: false })
  console.log("Step 3:", result3)

  console.log("\nEscalation log:", manager.escalationLog)
}

main().catch(console.error)

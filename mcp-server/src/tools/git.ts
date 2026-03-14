import { execSync } from "child_process"
import path from "path"
import { fileURLToPath } from "url"
import type {
  GitCreateBranchInput,
  GitCreateBranchOutput,
  GitCommitProgressInput,
  GitCommitProgressOutput,
  GitPushBranchOutput,
} from "../types.js"

// Resolve repo root relative to mcp-server/dist/tools/git.js
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.resolve(__dirname, "../../../..")

function exec(cmd: string): string {
  return execSync(cmd, { cwd: REPO_ROOT, encoding: "utf8" }).trim()
}

export function gitCreateBranch(input: GitCreateBranchInput): GitCreateBranchOutput {
  try {
    // Sanitize branch name
    const branch = input.name.replace(/[^a-zA-Z0-9/_-]/g, "-")
    exec(`git checkout -b "${branch}"`)
    return { success: true, branch }
  } catch (err) {
    return { success: false, branch: "", error: String(err) }
  }
}

export function gitCommitProgress(input: GitCommitProgressInput): GitCommitProgressOutput {
  try {
    // Stage the progress directory
    exec(`git add progress/`)
    const hash = exec(
      `git commit -m "${input.message.replace(/"/g, "'")}"`
    )
    // Extract hash from output like "[branch abc1234] message"
    const match = hash.match(/\[.*?\s+([a-f0-9]+)\]/)
    const commitHash = match ? match[1] : "unknown"
    return { success: true, commitHash }
  } catch (err) {
    return { success: false, commitHash: "", error: String(err) }
  }
}

export function gitPushBranch(): GitPushBranchOutput {
  try {
    const branch = exec("git rev-parse --abbrev-ref HEAD")
    exec(`git push -u origin "${branch}"`)
    return { success: true }
  } catch (err) {
    return { success: false, error: String(err) }
  }
}

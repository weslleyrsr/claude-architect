import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import type {
  StudentProgress,
  ProgressReadOutput,
  ProgressWriteInput,
  ProgressWriteOutput,
} from "../types.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.resolve(__dirname, "../../../..")
const PROGRESS_FILE = path.join(REPO_ROOT, "progress", "student.json")
const PROGRESS_DIR = path.join(REPO_ROOT, "progress")

export function progressRead(): ProgressReadOutput {
  try {
    if (!fs.existsSync(PROGRESS_FILE)) {
      return { exists: false }
    }
    const raw = fs.readFileSync(PROGRESS_FILE, "utf8")
    const data = JSON.parse(raw) as StudentProgress
    return { exists: true, data }
  } catch {
    return { exists: false }
  }
}

export function progressWrite(input: ProgressWriteInput): ProgressWriteOutput {
  try {
    if (!fs.existsSync(PROGRESS_DIR)) {
      fs.mkdirSync(PROGRESS_DIR, { recursive: true })
    }

    let existing: Partial<StudentProgress> = {}
    if (fs.existsSync(PROGRESS_FILE)) {
      try {
        existing = JSON.parse(fs.readFileSync(PROGRESS_FILE, "utf8"))
      } catch {
        // If parse fails, start fresh
      }
    }

    // Deep merge blocks
    const merged: StudentProgress = {
      ...(existing as StudentProgress),
      ...(input.data as StudentProgress),
      blocks: {
        ...(existing.blocks ?? {}),
        ...(input.data.blocks ?? {}),
      },
    }

    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(merged, null, 2), "utf8")
    return { success: true }
  } catch (err) {
    return { success: false, error: String(err) }
  }
}

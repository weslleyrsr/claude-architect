export interface BlockProgress {
  status: "not_started" | "jedi_passed" | "completed"
  completedAt: string
  quizScore: number          // 0-3
  exerciseAttempts: number
  timeSpentMinutes: number
  jediMode: boolean
}

export interface StudentProgress {
  name: string
  language: "ts" | "py"
  level: "beginner" | "intermediate" | "advanced"
  startedAt: string          // ISO date
  completedAt: string | null
  blocks: {
    [blockId: string]: BlockProgress
  }
}

export interface GitCreateBranchInput {
  name: string               // e.g. "student/alice-1710000000"
}

export interface GitCreateBranchOutput {
  success: boolean
  branch: string
  error?: string
}

export interface GitCommitProgressInput {
  message: string            // e.g. "complete block 1.3 - alice"
}

export interface GitCommitProgressOutput {
  success: boolean
  commitHash: string
  error?: string
}

export interface GitPushBranchOutput {
  success: boolean
  error?: string
}

export interface ProgressReadOutput {
  exists: boolean
  data?: StudentProgress
}

export interface ProgressWriteInput {
  data: Partial<StudentProgress>
}

export interface ProgressWriteOutput {
  success: boolean
  error?: string
}

export interface ValidateExerciseInput {
  block: string              // e.g. "1.1"
  code: string
  language: "ts" | "py"
}

export interface ValidateExerciseOutput {
  passed: boolean
  score: number              // 0-100
  feedback: string
  hints: string[]
  keyConceptsVerified: string[]
}

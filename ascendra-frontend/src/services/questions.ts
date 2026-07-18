import type { DiagnosticQuestion, DrillQuestion, InterviewQuestion } from '../types'
import { delay } from './delay'
import { DIAG, DRILL, IVPOOL } from './fixtures'

/** The 10 daily-drill questions. */
export async function getDrillQuestions(): Promise<DrillQuestion[]> {
  await delay(150)
  return DRILL
}

/** The 9 mock-interview questions, tagged by level. */
export async function getInterviewPool(): Promise<InterviewQuestion[]> {
  await delay(150)
  return IVPOOL
}

/** The 50-question resume-diagnostic bank. */
export async function getDiagnosticBank(): Promise<DiagnosticQuestion[]> {
  await delay(150)
  return DIAG
}

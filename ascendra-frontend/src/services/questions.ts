import type { CodingQuestion, DiagnosticQuestion, DrillQuestion, InterviewQuestion } from '../types'
import { delay } from './delay'
import { CODEPOOL, DIAG, DRILL, IVPOOL } from './fixtures'

/** Coding-test resource map: area → { res, url } (spec 07). */
export { CT_RES } from './fixtures'

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

/** The 12 mock-coding-test questions (4 areas × 3 levels). */
export async function getCodingPool(): Promise<CodingQuestion[]> {
  await delay(150)
  return CODEPOOL
}

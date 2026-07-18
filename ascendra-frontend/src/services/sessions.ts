import type { SessionRecord, TrendPoint } from '../types'
import { delay } from './delay'
import { HISTORY, MONTHS, TREND } from './fixtures'

/** Readiness trend: [22, 31, 44, 58, 68] across Mar–Jul. */
export async function getTrend(): Promise<TrendPoint[]> {
  await delay(150)
  return TREND.map((value, i) => ({ month: MONTHS[i], value }))
}

/** The 4 recent session rows. */
export async function getHistory(): Promise<SessionRecord[]> {
  await delay(150)
  return HISTORY
}

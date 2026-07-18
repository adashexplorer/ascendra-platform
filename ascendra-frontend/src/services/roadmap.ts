import type { Phase } from '../types'
import { delay } from './delay'
import { PHASES } from './fixtures'

export { EXTRA_GAPS, EXTRA_PHASE } from './fixtures'

/** The 4 base roadmap phases (extra phases come from prepStore). */
export async function getBasePhases(): Promise<Phase[]> {
  await delay(150)
  return PHASES
}

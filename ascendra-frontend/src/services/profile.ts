import type { Profile } from '../types'
import { delay } from './delay'
import { PROFILE } from './fixtures'

/** Readiness, target, delta, competencies, weak areas, gap tags. */
export async function getProfile(): Promise<Profile> {
  await delay(150)
  return PROFILE
}

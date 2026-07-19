import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GapItem, Phase } from '../types'
import { CT_RES, EXTRA_GAPS, EXTRA_PHASE } from '../services/fixtures'

interface PrepState {
  readiness: number
  target: number
  delta: string
  extraGaps: GapItem[]
  extraPhases: Phase[]
  diagTaken: boolean
  diagIdx: number
  drillIdx: number
  drillDone: boolean
  /** Adds EXTRA_GAPS + EXTRA_PHASE once and bumps readiness +4 (idempotent). */
  completeMockInterview: () => void
  /** Adds the "{area} (coding)" gap + coding-reinforcement phase once per area, readiness +3. */
  completeCodingTest: (area: string) => void
  submitDrillAnswer: () => void
  nextDrillQuestion: () => void
  setDiagIdx: (idx: number) => void
  finishDiagnostic: () => void
  resetDiagnostic: () => void
}

export const usePrepStore = create<PrepState>()(
  persist(
    (set) => ({
      readiness: 68,
      target: 85,
      delta: '+6 pts this week',
      extraGaps: [],
      extraPhases: [],
      diagTaken: false,
      diagIdx: 0,
      drillIdx: 0,
      drillDone: false,
      completeMockInterview: () =>
        set((s) =>
          s.extraPhases.some((p) => p.name === EXTRA_PHASE.name)
            ? s
            : {
                extraGaps: [...s.extraGaps, ...EXTRA_GAPS],
                extraPhases: [...s.extraPhases, EXTRA_PHASE],
                readiness: s.readiness + 4,
              },
        ),
      completeCodingTest: (area) =>
        set((s) => {
          const short = `${area} (coding)`
          if (s.extraGaps.some((g) => g.short === short)) return s
          const { res, url } = CT_RES[area] ?? CT_RES['Algorithms']
          const gap: GapItem = { short, long: `Coding practice: ${area}`, res, url }
          const phase: Phase = {
            name: 'Phase ' + (4 + s.extraPhases.length + 1) + ' · Coding reinforcement — ' + area,
            weeks: 'Next 2 weeks',
            status: 'New',
            state: 'active',
            modules: [
              { name: `${area} problem set (15 problems)`, res, url },
              { name: `Timed re-test on ${area}`, res: 'Mock coding test', url: 'https://leetcode.com/assessment/' },
            ],
          }
          return {
            extraGaps: [...s.extraGaps, gap],
            extraPhases: [...s.extraPhases, phase],
            readiness: s.readiness + 3,
          }
        }),
      submitDrillAnswer: () => set({ drillDone: true }),
      nextDrillQuestion: () =>
        set((s) => ({ drillIdx: Math.min(9, s.drillIdx + 1), drillDone: false })),
      setDiagIdx: (idx) => set({ diagIdx: idx }),
      finishDiagnostic: () => set({ diagTaken: true, diagIdx: 0 }),
      resetDiagnostic: () => set({ diagTaken: false, diagIdx: 0 }),
    }),
    {
      name: 'asc-prep',
      version: 2,
      // v1 persisted the old data shapes (string modules, gaps without res/url).
      // Migrating drops any stale extra arrays so reloads never render old shapes.
      migrate: (persisted, version) => {
        const state = (persisted ?? {}) as Partial<PrepState>
        if (version < 2) {
          return { ...state, extraGaps: [], extraPhases: [] }
        }
        return state
      },
    },
  ),
)

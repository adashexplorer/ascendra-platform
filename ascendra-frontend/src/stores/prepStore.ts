import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GapItem, Phase } from '../types'
import { EXTRA_GAPS, EXTRA_PHASE } from '../services/fixtures'

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
                extraGaps: [...EXTRA_GAPS],
                extraPhases: [EXTRA_PHASE],
                readiness: s.readiness + 4,
              },
        ),
      submitDrillAnswer: () => set({ drillDone: true }),
      nextDrillQuestion: () =>
        set((s) => ({ drillIdx: Math.min(9, s.drillIdx + 1), drillDone: false })),
      setDiagIdx: (idx) => set({ diagIdx: idx }),
      finishDiagnostic: () => set({ diagTaken: true, diagIdx: 0 }),
      resetDiagnostic: () => set({ diagTaken: false, diagIdx: 0 }),
    }),
    { name: 'asc-prep' },
  ),
)

import { create } from 'zustand'

interface UiState {
  chatOpen: boolean
  chatExpanded: boolean
  notesOpen: boolean
  openChat: () => void
  closeChat: () => void
  toggleExpand: () => void
  toggleNotes: () => void
}

/** Not persisted — chat UI state resets on reload. */
export const useUiStore = create<UiState>()((set) => ({
  chatOpen: false,
  chatExpanded: false,
  notesOpen: false,
  openChat: () => set({ chatOpen: true }),
  closeChat: () => set({ chatOpen: false }),
  toggleExpand: () => set((s) => ({ chatExpanded: !s.chatExpanded })),
  toggleNotes: () => set((s) => ({ notesOpen: !s.notesOpen })),
}))

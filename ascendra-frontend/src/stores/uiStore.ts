import { create } from 'zustand'

interface UiState {
  chatOpen: boolean
  chatExpanded: boolean
  openChat: () => void
  closeChat: () => void
  toggleExpand: () => void
}

/** Not persisted — chat UI state resets on reload. */
export const useUiStore = create<UiState>()((set) => ({
  chatOpen: false,
  chatExpanded: false,
  openChat: () => set({ chatOpen: true }),
  closeChat: () => set({ chatOpen: false }),
  toggleExpand: () => set((s) => ({ chatExpanded: !s.chatExpanded })),
}))

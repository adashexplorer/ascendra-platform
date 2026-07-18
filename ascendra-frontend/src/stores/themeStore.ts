import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'dark' | 'light'

interface ThemeState {
  theme: Theme
  toggle: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'dark',
      toggle: () =>
        set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
    }),
    { name: 'asc-theme' },
  ),
)

/** Keep <html data-theme> in sync with the store (init + every change). */
function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
}

applyTheme(useThemeStore.getState().theme)
useThemeStore.subscribe((state) => applyTheme(state.theme))

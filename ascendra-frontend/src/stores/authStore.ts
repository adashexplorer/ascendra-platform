import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types'

interface AuthState {
  user: User | null
  onboarded: boolean
  login: (email: string) => void
  register: (name: string, email: string) => void
  completeOnboarding: () => void
  logout: () => void
}

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0]!.toUpperCase())
    .slice(0, 2)
    .join('')
}

function makeUser(name: string, email: string): User {
  return { name, email, initials: initialsOf(name), plan: 'Pro plan' }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      onboarded: false,
      // Demo identity: name "Priya Menon" if none given.
      login: (email) => set({ user: makeUser('Priya Menon', email), onboarded: true }),
      register: (name, email) => set({ user: makeUser(name || 'Priya Menon', email), onboarded: false }),
      completeOnboarding: () => set({ onboarded: true }),
      logout: () => set({ user: null, onboarded: false }),
    }),
    { name: 'asc-auth' },
  ),
)

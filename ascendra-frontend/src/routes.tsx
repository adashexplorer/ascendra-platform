import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router'
import { AppShell } from './components/layout/AppShell'
import { useAuthStore } from './stores/authStore'
import { LoginScreen } from './features/auth/LoginScreen'
import { RegisterScreen } from './features/auth/RegisterScreen'
import { OnboardingScreen } from './features/onboarding/OnboardingScreen'
import { DiagnosticScreen } from './features/onboarding/DiagnosticScreen'
import { OverviewScreen } from './features/overview/OverviewScreen'
import { SkillGapsScreen } from './features/skill-gaps/SkillGapsScreen'
import { RoadmapScreen } from './features/roadmap/RoadmapScreen'
import { MockInterviewScreen } from './features/mock-interview/MockInterviewScreen'
import { PlaygroundScreen } from './features/playground/PlaygroundScreen'
import { DailyDrillScreen } from './features/daily-drill/DailyDrillScreen'
import { ProgressScreen } from './features/progress/ProgressScreen'

/**
 * Guard: no user → /login; authed but not onboarded → /onboarding
 * (except when already on an onboarding route).
 */
function RequireAuth({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user)
  const onboarded = useAuthStore((s) => s.onboarded)
  const location = useLocation()

  if (!user) return <Navigate to="/login" replace />

  const onOnboarding = location.pathname.startsWith('/onboarding')
  if (!onboarded && !onOnboarding) return <Navigate to="/onboarding" replace />

  return <>{children}</>
}

/** Guard for /login and /register: already authed → /. */
function RedirectIfAuthed({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user)
  if (user) return <Navigate to="/" replace />
  return <>{children}</>
}

export const routes = [
  {
    path: '/login',
    element: (
      <RedirectIfAuthed>
        <LoginScreen />
      </RedirectIfAuthed>
    ),
  },
  {
    path: '/register',
    element: (
      <RedirectIfAuthed>
        <RegisterScreen />
      </RedirectIfAuthed>
    ),
  },
  {
    path: '/onboarding',
    element: (
      <RequireAuth>
        <OnboardingScreen />
      </RequireAuth>
    ),
  },
  {
    path: '/onboarding/diagnostic',
    element: (
      <RequireAuth>
        <DiagnosticScreen />
      </RequireAuth>
    ),
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        <AppShell />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <OverviewScreen /> },
      { path: 'gaps', element: <SkillGapsScreen /> },
      { path: 'roadmap', element: <RoadmapScreen /> },
      { path: 'interview', element: <MockInterviewScreen /> },
      { path: 'playground', element: <PlaygroundScreen /> },
      { path: 'drill', element: <DailyDrillScreen /> },
      { path: 'progress', element: <ProgressScreen /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]

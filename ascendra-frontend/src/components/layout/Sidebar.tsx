import type { CSSProperties } from 'react'
import { NavLink, useNavigate } from 'react-router'
import {
  ArrowClockwise,
  ChartBar,
  Compass,
  MicrophoneStage,
  Path,
  SignOut,
  SquaresFour,
  SunHorizon,
  TrendUp,
} from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import { Button, Chip } from '../ui'
import { useAuthStore } from '../../stores/authStore'
import { usePrepStore } from '../../stores/prepStore'
import { cx } from '../ui/cx'

const NAV_ITEMS: { label: string; to: string; icon: Icon }[] = [
  { label: 'Overview', to: '/', icon: SquaresFour },
  { label: 'Skill Gaps', to: '/gaps', icon: ChartBar },
  { label: 'Roadmap', to: '/roadmap', icon: Path },
  { label: 'Mock Interview', to: '/interview', icon: MicrophoneStage },
  { label: 'Daily Drill', to: '/drill', icon: SunHorizon },
  { label: 'Progress', to: '/progress', icon: TrendUp },
]

const navLinkStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 11,
  width: '100%',
  padding: '9px 12px',
  borderRadius: 'var(--radius-md)',
  background: 'transparent',
  color: 'var(--color-neutral-300)',
  font: 'inherit',
  fontSize: 14,
  textDecoration: 'none',
  transition: 'background .12s',
}

export function Sidebar() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const resetDiagnostic = usePrepStore((s) => s.resetDiagnostic)

  return (
    <aside
      style={{
        width: 236,
        flex: 'none',
        minHeight: '100vh',
        background: 'var(--color-surface)',
        boxShadow: '1px 0 0 var(--color-divider)',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 14px',
        position: 'sticky',
        top: 0,
        alignSelf: 'flex-start',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '0 8px 20px' }}>
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: 'var(--radius-sm)',
            background: 'var(--color-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-bg)',
          }}
        >
          <Compass size={16} />
        </div>
        <span
          style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 600,
            fontSize: 18,
            letterSpacing: '-.01em',
          }}
        >
          Ascendra
        </span>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {NAV_ITEMS.map(({ label, to, icon: IconCmp }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => cx('asc-nav-hover', isActive && 'asc-nav-active')}
            style={navLinkStyle}
          >
            <IconCmp size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Chip
          style={{ justifyContent: 'center', width: '100%' }}
          onClick={() => {
            resetDiagnostic()
            navigate('/onboarding')
          }}
        >
          <ArrowClockwise size={16} />
          Re-run diagnostic
        </Chip>
        {user && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 8px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--color-neutral-900)',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'var(--color-accent-800)',
                color: 'var(--color-accent-100)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {user.initials}
            </div>
            <div style={{ lineHeight: 1.25, flex: 1 }}>
              <div style={{ fontSize: 13 }}>{user.name}</div>
              <div style={{ fontSize: 11, color: 'var(--color-neutral-500)' }}>{user.plan}</div>
            </div>
            <Button
              variant="ghost"
              icon
              title="Log out"
              aria-label="Log out"
              onClick={() => {
                logout()
                navigate('/login')
              }}
            >
              <SignOut size={18} />
            </Button>
          </div>
        )}
      </div>
    </aside>
  )
}

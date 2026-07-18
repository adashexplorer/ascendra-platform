import type { ReactNode } from 'react'
import { Compass } from '@phosphor-icons/react'
import { Card, ThemeToggle } from '../../components/ui'

/**
 * Shared auth chrome (spec 02): full-viewport centered column on the app
 * ground, 392px content column with the theme toggle pinned top-right and
 * the brand row centered above the card.
 */
export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg)',
        color: 'var(--color-text)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div style={{ width: '100%', maxWidth: 392, position: 'relative' }}>
        <ThemeToggle style={{ position: 'absolute', top: -4, right: 0 }} />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-accent)',
              color: 'var(--color-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Compass size={18} />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 600,
              fontSize: 21,
              letterSpacing: '-0.01em',
            }}
          >
            Ascendra
          </span>
        </div>
        <Card elev="md" style={{ padding: 28 }}>
          {children}
        </Card>
      </div>
    </div>
  )
}

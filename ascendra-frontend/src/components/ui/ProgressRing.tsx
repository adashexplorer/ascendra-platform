import type { HTMLAttributes } from 'react'
import { cx } from './cx'

export interface ProgressRingProps extends HTMLAttributes<HTMLDivElement> {
  /** Progress, 0–100. */
  value: number
  /** Outer diameter in px. */
  size?: number
  /** Stroke width in px. */
  stroke?: number
  /** Sub-caption under the number (e.g. "Readiness"). */
  label?: string
}

/** SVG progress ring: neutral-900 track, accent arc, centered number. */
export function ProgressRing({
  value,
  size = 132,
  stroke = 11,
  label,
  className,
  style,
  ...rest
}: ProgressRingProps) {
  const clamped = Math.max(0, Math.min(100, value))
  const c = size / 2
  const r = (size - stroke) / 2
  const circumference = 2 * Math.PI * r

  return (
    <div
      role="img"
      aria-label={`${Math.round(clamped)}%${label ? ` ${label}` : ''}`}
      className={cx(className)}
      style={{
        position: 'relative',
        width: size,
        height: size,
        flex: 'none',
        ...style,
      }}
      {...rest}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={c}
          cy={c}
          r={r}
          fill="none"
          stroke="var(--color-neutral-900)"
          strokeWidth={stroke}
        />
        <circle
          cx={c}
          cy={c}
          r={r}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - clamped / 100)}
          transform={`rotate(-90 ${c} ${c})`}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 600,
            fontSize: 38,
            lineHeight: 1,
            letterSpacing: '-0.015em',
          }}
        >
          {Math.round(clamped)}
        </div>
        {label ? (
          <div className="text-muted" style={{ fontSize: 11.5, marginTop: 2 }}>
            {label}
          </div>
        ) : null}
      </div>
    </div>
  )
}

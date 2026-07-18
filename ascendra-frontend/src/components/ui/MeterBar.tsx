import type { SVGAttributes } from 'react'
import { cx } from './cx'

export interface MeterBarProps
  extends Omit<SVGAttributes<SVGSVGElement>, 'target'> {
  /** Current level, 0–100. */
  value: number
  /** Target level, 0–100 — drawn as a neutral tick. */
  target: number
}

/** Competency meter: 10px pill track, accent fill, tick at the target. */
export function MeterBar({
  value,
  target,
  className,
  style,
  ...rest
}: MeterBarProps) {
  const v = Math.max(0, Math.min(100, value))
  const t = Math.max(0, Math.min(100, target))

  return (
    <svg
      viewBox="0 0 100 10"
      preserveAspectRatio="none"
      role="img"
      aria-label={`${Math.round(v)} of target ${Math.round(t)}`}
      className={cx(className)}
      style={{ display: 'block', width: '100%', height: 10, ...style }}
      {...rest}
    >
      <rect x={0} y={0} width={100} height={10} rx={5} fill="var(--color-neutral-900)" />
      <rect x={0} y={0} width={v} height={10} rx={5} fill="var(--color-accent)" />
      <rect x={Math.min(t, 99.4)} y={0} width={0.6} height={10} fill="var(--color-neutral-400)" />
    </svg>
  )
}

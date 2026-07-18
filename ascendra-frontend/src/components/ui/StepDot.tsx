import type { HTMLAttributes } from 'react'
import { cx } from './cx'

export interface StepDotProps extends HTMLAttributes<HTMLDivElement> {
  /** Step state → `.asc-dot-done` / `.asc-dot-active` / plain `.asc-dot`. */
  state: 'done' | 'active' | 'todo'
}

/** Numbered step indicator (`.asc-dot`). Children = the step number. */
export function StepDot({ state, className, ...rest }: StepDotProps) {
  return (
    <div
      className={cx(
        'asc-dot',
        state === 'done' && 'asc-dot-done',
        state === 'active' && 'asc-dot-active',
        className,
      )}
      {...rest}
    />
  )
}

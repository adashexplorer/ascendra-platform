import type { ButtonHTMLAttributes } from 'react'
import { cx } from './cx'

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Selected state → `.asc-chip-on`. */
  on?: boolean
}

/** Pill-shaped toggle chip (`.asc-chip`). Children usually `<Icon /> label`. */
export function Chip({ on = false, type = 'button', className, ...rest }: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={on}
      className={cx('asc-chip', on && 'asc-chip-on', className)}
      {...rest}
    />
  )
}

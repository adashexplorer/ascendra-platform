import type { InputHTMLAttributes } from 'react'
import { cx } from './cx'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Error state → `.asc-input-err` red border. */
  invalid?: boolean
}

export function Input({ invalid = false, className, ...rest }: InputProps) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cx('input', invalid && 'asc-input-err', className)}
      {...rest}
    />
  )
}

import type { TextareaHTMLAttributes } from 'react'
import { cx } from './cx'

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Error state → `.asc-input-err` red border. */
  invalid?: boolean
}

export function Textarea({ invalid = false, className, ...rest }: TextareaProps) {
  return (
    <textarea
      aria-invalid={invalid || undefined}
      className={cx('input', invalid && 'asc-input-err', className)}
      {...rest}
    />
  )
}

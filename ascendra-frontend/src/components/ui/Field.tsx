import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from './cx'

export interface FieldProps extends HTMLAttributes<HTMLDivElement> {
  /** Field label, rendered as the `.field > label`. */
  label: ReactNode
  /** Associates the label with an input id. */
  htmlFor?: string
  /** Error message — renders an `.asc-field-err` line below the control. */
  error?: string
  /** The control (usually an `<Input />` or `<Textarea />`). */
  children: ReactNode
}

export function Field({
  label,
  htmlFor,
  error,
  children,
  className,
  ...rest
}: FieldProps) {
  return (
    <div className={cx('field', className)} {...rest}>
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {error ? <div className="asc-field-err">{error}</div> : null}
    </div>
  )
}

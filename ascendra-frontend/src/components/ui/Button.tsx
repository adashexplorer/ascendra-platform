import type { ButtonHTMLAttributes } from 'react'
import { cx } from './cx'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant → `.btn-primary` / `.btn-secondary` / `.btn-ghost`. */
  variant?: 'primary' | 'secondary' | 'ghost'
  /** Square 36×36 icon-only button → `.btn-icon`. */
  icon?: boolean
  /** Full-width button → `.btn-block`. */
  block?: boolean
}

export function Button({
  variant = 'primary',
  icon = false,
  block = false,
  type = 'button',
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        'btn',
        `btn-${variant}`,
        icon && 'btn-icon',
        block && 'btn-block',
        className,
      )}
      {...rest}
    />
  )
}

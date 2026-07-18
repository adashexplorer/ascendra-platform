import { useEffect } from 'react'
import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from './cx'

export interface DialogProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Whether the dialog is shown; renders nothing when false. */
  open: boolean
  /** Called on backdrop click or Escape. */
  onClose: () => void
  /** Rendered as the `.dialog-title`. */
  title?: ReactNode
  /** Rendered in the `.dialog-actions` row (usually `<Button />`s). */
  actions?: ReactNode
  /** Dialog body content (`.dialog-body`). */
  children?: ReactNode
}

export function Dialog({
  open,
  onClose,
  title,
  actions,
  children,
  className,
  ...rest
}: DialogProps) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="dialog-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={cx('dialog', className)}
        {...rest}
      >
        {title != null && <div className="dialog-title">{title}</div>}
        {children != null && <div className="dialog-body">{children}</div>}
        {actions != null && <div className="dialog-actions">{actions}</div>}
      </div>
    </div>
  )
}

import type { HTMLAttributes } from 'react'
import { cx } from './cx'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Elevation utility → `.elev-sm` / `.elev-md` / `.elev-lg`. */
  elev?: 'sm' | 'md' | 'lg'
  /** Lift-on-hover treatment → `.asc-card-hover`. */
  hover?: boolean
}

export function Card({ elev, hover = false, className, ...rest }: CardProps) {
  return (
    <div
      className={cx(
        'card',
        elev && `elev-${elev}`,
        hover && 'asc-card-hover',
        className,
      )}
      {...rest}
    />
  )
}

export function CardKicker({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('card-kicker', className)} {...rest} />
}

export function CardTitle({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('card-title', className)} {...rest} />
}

export function CardBody({ className, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cx('card-body', className)} {...rest} />
}

export function CardMeta({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('card-meta', className)} {...rest} />
}

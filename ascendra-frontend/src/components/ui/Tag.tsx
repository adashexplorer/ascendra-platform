import type { HTMLAttributes } from 'react'
import { cx } from './cx'

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  /** Visual variant → `.tag-accent` / `.tag-neutral` / `.tag-outline`. */
  variant?: 'accent' | 'neutral' | 'outline'
}

export function Tag({ variant = 'neutral', className, ...rest }: TagProps) {
  return <span className={cx('tag', `tag-${variant}`, className)} {...rest} />
}

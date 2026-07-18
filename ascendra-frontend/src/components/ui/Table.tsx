import type { TableHTMLAttributes } from 'react'
import { cx } from './cx'

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {}

/** Nocturne `.table` — caller supplies `<thead>` / `<tbody>` children. */
export function Table({ className, ...rest }: TableProps) {
  return <table className={cx('table', className)} {...rest} />
}

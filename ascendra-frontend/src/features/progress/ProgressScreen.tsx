import { useEffect, useState } from 'react'
import { ArrowUpRight } from '@phosphor-icons/react'
import { Card, CardTitle, Table } from '../../components/ui'
import { getHistory, getTrend } from '../../services/sessions'
import type { SessionRecord, TrendPoint } from '../../types'

const W = 560
const H = 170
const PAD = 8
const GRIDLINES = [45, 95, 145]

/** Prototype point math: x = pad + i·(w−2·pad)/4; y = h − (v/100)·(h−20) − 6. */
function toPoint(value: number, i: number): [number, number] {
  const x = PAD + (i * (W - 2 * PAD)) / 4
  const y = H - (value / 100) * (H - 20) - 6
  return [x, y]
}

export function ProgressScreen() {
  const [trend, setTrend] = useState<TrendPoint[] | null>(null)
  const [history, setHistory] = useState<SessionRecord[] | null>(null)

  useEffect(() => {
    let live = true
    getTrend().then((t) => {
      if (live) setTrend(t)
    })
    getHistory().then((h) => {
      if (live) setHistory(h)
    })
    return () => {
      live = false
    }
  }, [])

  if (!trend || !history) return null

  const points = trend
    .map((p, i) => toPoint(p.value, i).join(','))
    .join(' ')
  const area = `${PAD},${H} ${points} ${W - PAD},${H}`

  return (
    <div>
      <h1 style={{ fontSize: 28, margin: '0 0 4px' }}>Progress</h1>
      <p className="text-muted" style={{ margin: '0 0 22px', fontSize: 14 }}>
        Readiness over the last five months.
      </p>

      <Card elev="sm" style={{ padding: 22, marginBottom: 16 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 14,
          }}
        >
          <CardTitle>Readiness trend</CardTitle>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              fontSize: 13,
              color: 'var(--color-accent-200)',
            }}
          >
            <ArrowUpRight size={15} />
            +46 pts since March
          </span>
        </div>
        <svg
          viewBox="0 0 560 200"
          style={{ width: '100%', display: 'block' }}
          role="img"
          aria-label="Readiness trend chart, Mar to Jul"
        >
          {GRIDLINES.map((y) => (
            <line
              key={y}
              x1={PAD}
              y1={y}
              x2={W - PAD}
              y2={y}
              stroke="var(--color-divider)"
            />
          ))}
          <polygon points={area} fill="var(--color-accent-900)" opacity={0.5} />
          <polyline
            points={points}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth={2.5}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 11,
            color: 'var(--color-neutral-500)',
          }}
        >
          {trend.map((p) => (
            <span key={p.month}>{p.month}</span>
          ))}
        </div>
      </Card>

      <Card elev="sm" style={{ padding: 20 }}>
        <CardTitle style={{ marginBottom: 12 }}>Session history</CardTitle>
        <Table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Session</th>
              <th>Focus</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {history.map((r) => (
              <tr key={r.date}>
                <td>{r.date}</td>
                <td>{r.kind}</td>
                <td className="text-muted">{r.focus}</td>
                <td>{r.score}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  )
}

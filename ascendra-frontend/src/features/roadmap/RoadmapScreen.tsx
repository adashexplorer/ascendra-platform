import { useEffect, useState, type CSSProperties } from 'react'
import { BookOpenText } from '@phosphor-icons/react'
import { Card, CardTitle, Tag, type TagProps } from '../../components/ui'
import { getBasePhases } from '../../services/roadmap'
import { usePrepStore } from '../../stores/prepStore'
import type { Phase } from '../../types'

const TAG_BY_STATE: Record<Phase['state'], NonNullable<TagProps['variant']>> = {
  done: 'neutral',
  active: 'accent',
  next: 'outline',
}

function dotStyle(state: Phase['state']): CSSProperties {
  const base: CSSProperties = {
    width: 12,
    height: 12,
    borderRadius: '50%',
    flex: 'none',
    marginTop: 5,
  }
  if (state === 'done') return { ...base, background: 'var(--color-neutral-500)' }
  if (state === 'active') return { ...base, background: 'var(--color-accent)' }
  return {
    ...base,
    background: 'transparent',
    boxShadow: 'inset 0 0 0 1.5px var(--color-neutral-600)',
  }
}

export function RoadmapScreen() {
  const extraPhases = usePrepStore((s) => s.extraPhases)
  const [basePhases, setBasePhases] = useState<Phase[]>([])

  useEffect(() => {
    let cancelled = false
    getBasePhases().then((ph) => {
      if (!cancelled) setBasePhases(ph)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const phases = [...basePhases, ...extraPhases]

  return (
    <div>
      <h1 style={{ fontSize: 28, margin: '0 0 4px' }}>Personalized roadmap</h1>
      <p className="text-muted" style={{ margin: '0 0 24px', fontSize: 14 }}>
        Built from your skill gaps. New phases are appended as mock interviews
        surface weaknesses — nothing is removed.
      </p>
      <div style={{ position: 'relative', paddingLeft: 6 }}>
        {phases.map((p) => (
          <div
            key={p.name}
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: 16,
              paddingBottom: 8,
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div style={dotStyle(p.state)} />
              <div
                style={{
                  width: 2,
                  flex: 1,
                  background: 'var(--color-divider)',
                  margin: '6px 0',
                }}
              />
            </div>
            <Card elev="sm" hover style={{ padding: 18, marginBottom: 16 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <CardTitle style={{ fontSize: 16 }}>{p.name}</CardTitle>
                  <div className="text-muted" style={{ fontSize: 12 }}>
                    {p.weeks}
                  </div>
                </div>
                <Tag variant={TAG_BY_STATE[p.state]}>{p.status}</Tag>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  marginTop: 12,
                }}
              >
                {p.modules.map((m) => (
                  <div
                    key={m}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 9,
                      fontSize: 13,
                      padding: '6px 0',
                      boxShadow: 'inset 0 -1px 0 var(--color-divider)',
                    }}
                  >
                    <BookOpenText size={16} color="var(--color-neutral-500)" />
                    {m}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}

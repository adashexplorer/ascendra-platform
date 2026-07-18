import { useEffect, useState } from 'react'
import { Button, Card, StepDot, Tag, Textarea } from '../../components/ui'
import { getDrillQuestions } from '../../services/questions'
import { usePrepStore } from '../../stores/prepStore'
import type { DrillQuestion } from '../../types'

export function DailyDrillScreen() {
  const drillIdx = usePrepStore((s) => s.drillIdx)
  const drillDone = usePrepStore((s) => s.drillDone)
  const submitDrillAnswer = usePrepStore((s) => s.submitDrillAnswer)
  const nextDrillQuestion = usePrepStore((s) => s.nextDrillQuestion)

  const [questions, setQuestions] = useState<DrillQuestion[] | null>(null)
  const [answer, setAnswer] = useState('')

  useEffect(() => {
    let live = true
    getDrillQuestions().then((qs) => {
      if (live) setQuestions(qs)
    })
    return () => {
      live = false
    }
  }, [])

  if (!questions) return null

  const active = questions[drillIdx]

  const advance = () => {
    nextDrillQuestion()
    setAnswer('')
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 6,
        }}
      >
        <h1 style={{ fontSize: 28, margin: 0 }}>Today's drill</h1>
        <Tag variant="outline">Question {drillIdx + 1} of 10</Tag>
      </div>
      <p className="text-muted" style={{ margin: '0 0 22px', fontSize: 14 }}>
        Ten short questions from your weakest areas, delivered every morning.
        Answers feed back into your readiness score.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '64px 1fr', gap: 20 }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
          }}
        >
          {questions.map((q, i) => (
            <StepDot
              key={q.q}
              state={i < drillIdx ? 'done' : i === drillIdx ? 'active' : 'todo'}
            >
              {i + 1}
            </StepDot>
          ))}
        </div>

        <div>
          <Card elev="md" style={{ padding: 22 }}>
            <Tag variant="accent" style={{ alignSelf: 'flex-start' }}>
              {active.area}
            </Tag>
            <div style={{ fontSize: 18, lineHeight: 1.5, margin: '12px 0 4px' }}>
              {active.q}
            </div>
            <div style={{ marginTop: 8 }}>
              <Textarea
                placeholder="Type your answer…"
                aria-label="Your answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
            </div>

            {drillDone && (
              <div
                style={{
                  marginTop: 16,
                  padding: 16,
                  borderRadius: 10,
                  background: 'var(--color-accent-900)',
                  boxShadow: 'inset 0 0 0 1px var(--color-accent-700)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    marginBottom: 8,
                  }}
                >
                  <Tag variant="accent">Scored 7 / 10</Tag>
                  <span className="text-muted" style={{ fontSize: 12 }}>
                    Noted for tomorrow's set
                  </span>
                </div>
                <p style={{ fontSize: 13.5, margin: '0 0 8px' }}>
                  <strong style={{ color: 'var(--color-accent-200)' }}>
                    Strong:
                  </strong>{' '}
                  you named the right isolation boundary and gave a concrete
                  reproduction path.
                </p>
                <p style={{ fontSize: 13.5, margin: 0 }}>
                  <strong style={{ color: 'var(--color-accent-200)' }}>
                    Improve:
                  </strong>{' '}
                  tie the test back to a failure mode — what breaks in
                  production if this isn't caught? Add a load dimension.
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              {drillDone ? (
                <Button variant="primary" onClick={advance}>
                  Next question →
                </Button>
              ) : (
                <Button variant="primary" onClick={submitDrillAnswer}>
                  Submit answer
                </Button>
              )}
              <Button variant="ghost" onClick={advance}>
                Skip
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

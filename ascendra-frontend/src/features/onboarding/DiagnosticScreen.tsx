import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { ArrowLeft, ArrowRight, Check, X } from '@phosphor-icons/react'
import { Button, Card, Tag, Textarea } from '../../components/ui'
import { getDiagnosticBank } from '../../services/questions'
import { usePrepStore } from '../../stores/prepStore'
import type { DiagnosticQuestion } from '../../types'

export function DiagnosticScreen() {
  const navigate = useNavigate()
  const idx = usePrepStore((s) => s.diagIdx)
  const setDiagIdx = usePrepStore((s) => s.setDiagIdx)
  const finishDiagnostic = usePrepStore((s) => s.finishDiagnostic)

  const [bank, setBank] = useState<DiagnosticQuestion[]>([])
  // Session-local answers so Previous shows what was typed earlier.
  const [answers, setAnswers] = useState<Record<number, string>>({})

  useEffect(() => {
    let cancelled = false
    getDiagnosticBank().then((b) => {
      if (!cancelled) setBank(b)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const total = bank.length || 50
  const q = bank[idx]
  const atLast = idx >= total - 1

  const goNext = () => setDiagIdx(Math.min(total - 1, idx + 1))

  const finish = () => {
    finishDiagnostic()
    navigate('/onboarding', { state: { step: 2 } })
  }

  return (
    <div style={{ padding: '40px 24px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            marginBottom: 6,
          }}
        >
          <h1 style={{ fontSize: 26, margin: 0 }}>Diagnostic test</h1>
          <Button
            variant="ghost"
            onClick={() => navigate('/onboarding', { state: { step: 1 } })}
          >
            <X size={16} />
            Save & exit
          </Button>
        </div>
        <p className="text-muted" style={{ margin: '0 0 18px', fontSize: 14 }}>
          Answer in your own words — there's no timer. Your responses baseline
          your readiness and curate your plan.
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              flex: 1,
              height: 8,
              borderRadius: 4,
              background: 'var(--color-neutral-900)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                background: 'var(--color-accent)',
                width: `${((idx + 1) / total) * 100}%`,
                transition: 'width .2s',
              }}
            />
          </div>
          <span
            className="text-muted"
            style={{ fontSize: 12.5, whiteSpace: 'nowrap' }}
          >
            {idx + 1} / {total}
          </span>
        </div>

        {q && (
          <Card elev="md" style={{ padding: 24 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              <Tag variant="neutral">{q.area}</Tag>
              <Tag variant="outline">{q.level}</Tag>
            </div>
            <div style={{ fontSize: 18, lineHeight: 1.5, marginBottom: 12 }}>
              {q.q}
            </div>
            <div className="field">
              <Textarea
                placeholder="Type your answer…"
                value={answers[idx] ?? ''}
                onChange={(e) =>
                  setAnswers((a) => ({ ...a, [idx]: e.target.value }))
                }
              />
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginTop: 16,
              }}
            >
              {idx > 0 && (
                <Button
                  variant="secondary"
                  onClick={() => setDiagIdx(idx - 1)}
                >
                  <ArrowLeft size={16} />
                  Previous
                </Button>
              )}
              <Button variant="ghost" onClick={goNext}>
                Skip
              </Button>
              {atLast ? (
                <Button style={{ marginLeft: 'auto' }} onClick={finish}>
                  <Check size={16} />
                  Finish & curate plan
                </Button>
              ) : (
                <Button style={{ marginLeft: 'auto' }} onClick={goNext}>
                  Save & next
                  <ArrowRight size={16} />
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import {
  ArrowRight,
  Code,
  Microphone,
  MicrophoneStage,
  PlusCircle,
  Target,
} from '@phosphor-icons/react'
import {
  Button,
  Card,
  CardKicker,
  Chip,
  Field,
  Tag,
  Textarea,
} from '../../components/ui'
import { getInterviewPool } from '../../services/questions'
import { usePrepStore } from '../../stores/prepStore'
import type { InterviewQuestion, QuestionLevel } from '../../types'
import { CodingTest } from './CodingTest'

const LEVELS: Array<'all' | QuestionLevel> = [
  'all',
  'Beginner',
  'Intermediate',
  'Advanced',
]

const LEVEL_LABELS: Record<'all' | QuestionLevel, string> = {
  all: 'All',
  Beginner: 'Beginner',
  Intermediate: 'Intermediate',
  Advanced: 'Advanced',
}

export function MockInterviewScreen() {
  const navigate = useNavigate()
  const completeMockInterview = usePrepStore((s) => s.completeMockInterview)

  const [mode, setMode] = useState<'interview' | 'coding'>('interview')
  const [pool, setPool] = useState<InterviewQuestion[]>([])
  const [level, setLevel] = useState<'all' | QuestionLevel>('all')
  const [idx, setIdx] = useState(0)
  const [complete, setComplete] = useState(false)
  const [answer, setAnswer] = useState('')

  useEffect(() => {
    let live = true
    getInterviewPool().then((qs) => {
      if (live) setPool(qs)
    })
    return () => {
      live = false
    }
  }, [])

  if (pool.length === 0) return null

  const questions =
    level === 'all' ? pool : pool.filter((q) => q.level === level)
  const total = questions.length
  const round = complete ? total : idx + 1
  const isLast = idx === total - 1
  const answered = questions.slice(0, idx)
  const active = questions[idx]

  const areas = [...new Set(pool.map((q) => q.area.split(' · ')[0]))]

  const pickLevel = (lv: 'all' | QuestionLevel) => {
    setLevel(lv)
    setIdx(0)
    setComplete(false)
    setAnswer('')
  }

  const advance = () => {
    if (isLast) {
      completeMockInterview()
      setComplete(true)
    } else {
      setIdx(idx + 1)
    }
    setAnswer('')
  }

  const restart = () => {
    setIdx(0)
    setComplete(false)
    setAnswer('')
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          marginBottom: 18,
        }}
      >
        <Chip on={mode === 'interview'} onClick={() => setMode('interview')}>
          <MicrophoneStage size={15} />
          Adaptive interview
        </Chip>
        <Chip on={mode === 'coding'} onClick={() => setMode('coding')}>
          <Code size={15} />
          Mock coding test
        </Chip>
      </div>

      {mode === 'coding' ? (
        <CodingTest />
      ) : (
        <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 6,
        }}
      >
        <h1 style={{ fontSize: 28, margin: 0 }}>Adaptive mock interview</h1>
        <Tag variant="outline">
          Round {round} of {total}
        </Tag>
      </div>
      <p className="text-muted" style={{ margin: '0 0 16px', fontSize: 14 }}>
        Questions adapt to how you answer. Speak or type — you'll get scored
        feedback at the end.
      </p>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flexWrap: 'wrap',
          marginBottom: 12,
        }}
      >
        <span className="text-muted" style={{ fontSize: 12 }}>
          Level
        </span>
        {LEVELS.map((lv) => (
          <Chip key={lv} on={level === lv} onClick={() => pickLevel(lv)}>
            {LEVEL_LABELS[lv]}
          </Chip>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          flexWrap: 'wrap',
          marginBottom: 20,
          fontSize: 12.5,
          color: 'var(--color-neutral-400)',
        }}
      >
        <Target size={16} color="var(--color-accent)" />
        <span>Drawn from your current skill gaps:</span>
        {areas.map((a) => (
          <Tag key={a} variant="neutral">
            {a}
          </Tag>
        ))}
      </div>

      {!complete ? (
        <div>
          {answered.map((q) => (
            <Card
              key={q.q}
              style={{ padding: 16, marginBottom: 10, opacity: 0.7 }}
            >
              <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                <Tag variant="neutral">{q.area}</Tag>
                <Tag variant="outline">{q.level}</Tag>
                <Tag variant="accent" style={{ marginLeft: 'auto' }}>
                  Answered
                </Tag>
              </div>
              <div style={{ fontSize: 14 }}>{q.q}</div>
            </Card>
          ))}

          <Card elev="md" style={{ padding: 22 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <Tag variant="neutral">{active.area}</Tag>
              <Tag variant="outline">{active.level}</Tag>
            </div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  flex: 'none',
                  borderRadius: '50%',
                  background: 'var(--color-accent-800)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MicrophoneStage size={16} color="var(--color-accent-100)" />
              </div>
              <div style={{ fontSize: 17, lineHeight: 1.5, paddingTop: 4 }}>
                {active.q}
              </div>
            </div>
            <Field label="Your answer" htmlFor="iv-answer">
              <Textarea
                id="iv-answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Structure your answer… (the interviewer follows up based on what you say)"
              />
            </Field>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginTop: 14,
              }}
            >
              <Button variant="secondary">
                <Microphone size={16} />
                Record
              </Button>
              <Button
                variant="primary"
                style={{ marginLeft: 'auto' }}
                onClick={advance}
              >
                {isLast ? 'Finish & score' : 'Submit & continue'}
                <ArrowRight size={16} />
              </Button>
            </div>
          </Card>
        </div>
      ) : (
        <Card elev="md" style={{ padding: 24 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 12,
            }}
          >
            <Tag variant="accent">Session scored · 3.4 / 5</Tag>
            <span className="text-muted" style={{ fontSize: 12 }}>
              Readiness +4
            </span>
          </div>
          <h3 style={{ fontSize: 21, margin: '0 0 10px' }}>
            Nice work — here's what changed
          </h3>
          <p style={{ fontSize: 14, margin: '0 0 16px', maxWidth: 640 }}>
            Strong on flaky-test triage and coverage trade-offs. Two new
            weaknesses surfaced under the advanced system-design questions —
            they've been folded into your plan.
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 12,
            }}
          >
            <div
              style={{
                padding: 15,
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-neutral-900)',
              }}
            >
              <CardKicker>New skill gaps added</CardKicker>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 6,
                  marginTop: 9,
                }}
              >
                <Tag variant="outline">Rate-limiter partitions</Tag>
                <Tag variant="outline">Impact metrics</Tag>
              </div>
            </div>
            <div
              style={{
                padding: 15,
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-neutral-900)',
              }}
            >
              <CardKicker>Roadmap updated</CardKicker>
              <div
                style={{
                  fontSize: 13,
                  marginTop: 9,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <PlusCircle size={16} color="var(--color-accent)" />
                Phase 5 appended — existing phases kept
              </div>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              gap: 10,
              marginTop: 18,
              flexWrap: 'wrap',
            }}
          >
            <Button variant="primary" onClick={() => navigate('/roadmap')}>
              View updated roadmap
            </Button>
            <Button variant="secondary" onClick={() => navigate('/gaps')}>
              See skill gaps
            </Button>
            <Button variant="ghost" onClick={restart}>
              New session
            </Button>
          </div>
        </Card>
      )}
        </div>
      )}
    </div>
  )
}

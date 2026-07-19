import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import {
  ArrowRight,
  ArrowSquareOut,
  Code,
  Play,
  PlusCircle,
  SlidersHorizontal,
  X,
} from '@phosphor-icons/react'
import {
  Button,
  Card,
  CardKicker,
  CardTitle,
  Chip,
  Field,
  Tag,
  Textarea,
} from '../../components/ui'
import { CT_RES, getCodingPool } from '../../services/questions'
import { usePrepStore } from '../../stores/prepStore'
import type { CodingQuestion, QuestionLevel } from '../../types'

type Stage = 'setup' | 'active' | 'done'

const LEVEL_CHIPS: Array<{ value: QuestionLevel | null; label: string }> = [
  { value: null, label: 'Random' },
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' },
]

const COUNT_CHIPS: Array<{ value: number | null; label: string }> = [
  { value: null, label: 'Random' },
  { value: 3, label: '3 questions' },
  { value: 5, label: '5 questions' },
  { value: 10, label: '10 questions' },
]

const AREA_CHIPS: Array<{ value: string | null; label: string }> = [
  { value: null, label: 'Random' },
  { value: 'Arrays & Strings', label: 'Arrays & Strings' },
  { value: 'Data Structures', label: 'Data Structures' },
  { value: 'Concurrency', label: 'Concurrency' },
  { value: 'Algorithms', label: 'Algorithms' },
]

const PANEL_STYLE: React.CSSProperties = {
  padding: 15,
  borderRadius: 'var(--radius-md)',
  background: 'var(--color-neutral-900)',
}

export function CodingTest() {
  const navigate = useNavigate()
  const completeCodingTest = usePrepStore((s) => s.completeCodingTest)

  const [pool, setPool] = useState<CodingQuestion[]>([])
  const [stage, setStage] = useState<Stage>('setup')
  const [ctLevel, setCtLevel] = useState<QuestionLevel | null>(null)
  const [ctCount, setCtCount] = useState<number | null>(null)
  const [ctArea, setCtArea] = useState<string | null>(null)
  const [qs, setQs] = useState<CodingQuestion[]>([])
  const [idx, setIdx] = useState(0)
  const [code, setCode] = useState('')

  useEffect(() => {
    let live = true
    getCodingPool().then((questions) => {
      if (live) setPool(questions)
    })
    return () => {
      live = false
    }
  }, [])

  if (pool.length === 0) return null

  const total = qs.length
  const isLast = idx >= total - 1
  const active = qs[Math.min(idx, Math.max(0, total - 1))]

  const weakArea =
    ctArea ?? (qs.length > 0 ? qs[qs.length - 1].area : 'Concurrency')
  const resource = CT_RES[weakArea] ?? CT_RES['Algorithms']
  const solved = Math.max(1, Math.round(total * 0.6))

  const start = () => {
    let filtered = pool.filter(
      (q) =>
        (!ctLevel || q.level === ctLevel) && (!ctArea || q.area === ctArea),
    )
    if (filtered.length === 0) filtered = pool.slice()
    const shuffled = filtered.slice().sort(() => Math.random() - 0.5)
    setQs(shuffled.slice(0, Math.min(ctCount ?? 5, shuffled.length)))
    setIdx(0)
    setCode('')
    setStage('active')
  }

  const advance = () => {
    if (isLast) {
      completeCodingTest(weakArea)
      setStage('done')
    } else {
      setIdx(idx + 1)
    }
    setCode('')
  }

  const restart = () => {
    setStage('setup')
    setQs([])
    setIdx(0)
    setCode('')
  }

  return (
    <div>
      <h1 style={{ fontSize: 28, margin: '0 0 4px' }}>Mock coding test</h1>
      <p className="text-muted" style={{ margin: '0 0 18px', fontSize: 14 }}>
        Solve coding questions under interview conditions. Your result is
        assessed and feeds straight into your skill gaps and roadmap.
      </p>

      {stage === 'setup' && (
        <Card elev="md" style={{ padding: 24 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 4,
            }}
          >
            <SlidersHorizontal size={17} color="var(--color-accent)" />
            <CardTitle style={{ fontSize: 15 }}>Set up your test</CardTitle>
          </div>
          <p
            className="text-muted"
            style={{ fontSize: 12.5, margin: '0 0 18px' }}
          >
            All fields are optional — anything left on <strong>Random</strong>{' '}
            is picked for you from a mixed pool.
          </p>
          <CardKicker>Difficulty</CardKicker>
          <div
            style={{
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap',
              margin: '8px 0 16px',
            }}
          >
            {LEVEL_CHIPS.map((c) => (
              <Chip
                key={c.label}
                on={ctLevel === c.value}
                onClick={() => setCtLevel(c.value)}
              >
                {c.label}
              </Chip>
            ))}
          </div>
          <CardKicker>Number of questions</CardKicker>
          <div
            style={{
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap',
              margin: '8px 0 16px',
            }}
          >
            {COUNT_CHIPS.map((c) => (
              <Chip
                key={c.label}
                on={ctCount === c.value}
                onClick={() => setCtCount(c.value)}
              >
                {c.label}
              </Chip>
            ))}
          </div>
          <CardKicker>Area</CardKicker>
          <div
            style={{
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap',
              margin: '8px 0 20px',
            }}
          >
            {AREA_CHIPS.map((c) => (
              <Chip
                key={c.label}
                on={ctArea === c.value}
                onClick={() => setCtArea(c.value)}
              >
                {c.label}
              </Chip>
            ))}
          </div>
          <Button
            variant="primary"
            style={{ alignSelf: 'flex-start' }}
            onClick={start}
          >
            <Play size={16} />
            Start coding test
          </Button>
        </Card>
      )}

      {stage === 'active' && active && (
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 14,
            }}
          >
            <Tag variant="outline">
              Question {Math.min(idx, Math.max(0, total - 1)) + 1} of {total}
            </Tag>
            <Button variant="ghost" onClick={restart}>
              <X size={16} />
              Abandon test
            </Button>
          </div>
          <Card elev="md" style={{ padding: 22 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <Tag variant="neutral">{active.area}</Tag>
              <Tag variant="outline">{active.level}</Tag>
            </div>
            <div style={{ fontSize: 17, lineHeight: 1.5, marginBottom: 14 }}>
              {active.q}
            </div>
            <Field label="Your solution" htmlFor="ct-solution">
              <Textarea
                id="ct-solution"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                style={{
                  fontFamily: 'ui-monospace,SFMono-Regular,Menlo,monospace',
                  minHeight: 190,
                  fontSize: 13,
                }}
                placeholder="// Write your code here — or draft it in the Playground and paste it back"
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
              <Button variant="secondary" onClick={() => navigate('/playground')}>
                <Code size={16} />
                Open playground
              </Button>
              <Button
                variant="primary"
                style={{ marginLeft: 'auto' }}
                onClick={advance}
              >
                {isLast ? 'Finish & assess' : 'Submit & next'}
                <ArrowRight size={16} />
              </Button>
            </div>
          </Card>
        </div>
      )}

      {stage === 'done' && (
        <Card elev="md" style={{ padding: 24 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 12,
            }}
          >
            <Tag variant="accent">
              Assessed · {solved} / {total} solved
            </Tag>
            <span className="text-muted" style={{ fontSize: 12 }}>
              Readiness +3
            </span>
          </div>
          <h3 style={{ fontSize: 21, margin: '0 0 10px' }}>
            Test assessed — plan updated
          </h3>
          <p style={{ fontSize: 14, margin: '0 0 16px', maxWidth: 640 }}>
            Solid problem decomposition, but <strong>{weakArea}</strong> cost
            you the most time and correctness. It's been added to your skill
            gaps and a reinforcement phase was appended to your roadmap.
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 12,
            }}
          >
            <div style={PANEL_STYLE}>
              <CardKicker>Skill gap added</CardKicker>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 6,
                  marginTop: 9,
                }}
              >
                <Tag variant="outline">{weakArea} (coding)</Tag>
              </div>
              <a
                className="asc-res"
                href={resource.url}
                target="_blank"
                rel="noopener"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  fontSize: 12,
                  color: 'var(--color-accent)',
                  marginTop: 10,
                }}
              >
                <span className="asc-res-lnk">{resource.res}</span>
                <ArrowSquareOut size={14} />
              </a>
            </div>
            <div style={PANEL_STYLE}>
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
                Coding-reinforcement phase appended — existing phases kept
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
              New coding test
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}

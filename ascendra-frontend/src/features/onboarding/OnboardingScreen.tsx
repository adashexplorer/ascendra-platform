import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import {
  CheckCircle,
  DotOutline,
  FileArrowUp,
  FilePdf,
  Info,
  LockSimple,
  Play,
} from '@phosphor-icons/react'
import { Button, Card, CardKicker, Tag } from '../../components/ui'
import { getDiagnosticBank } from '../../services/questions'
import { getProfile } from '../../services/profile'
import { getBasePhases } from '../../services/roadmap'
import { usePrepStore } from '../../stores/prepStore'
import { useAuthStore } from '../../stores/authStore'
import type { DiagnosticQuestion, Phase, Profile } from '../../types'

function clampStep(step: number): number {
  return Math.min(2, Math.max(0, step))
}

export function OnboardingScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const initialStep = clampStep(
    (location.state as { step?: number } | null)?.step ?? 0,
  )
  const [step, setStep] = useState(initialStep)

  const diagTaken = usePrepStore((s) => s.diagTaken)
  const extraGaps = usePrepStore((s) => s.extraGaps)
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding)

  const [bank, setBank] = useState<DiagnosticQuestion[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [phases, setPhases] = useState<Phase[]>([])

  useEffect(() => {
    let cancelled = false
    Promise.all([getDiagnosticBank(), getProfile(), getBasePhases()]).then(
      ([b, p, ph]) => {
        if (cancelled) return
        setBank(b)
        setProfile(p)
        setPhases(ph)
      },
    )
    return () => {
      cancelled = true
    }
  }, [])

  const gapCount = (profile?.gapTags.length ?? 0) + extraGaps.length

  return (
    <div style={{ padding: '40px 24px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', paddingTop: 10 }}>
        {/* Progress rail */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 26 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 2,
                background:
                  i <= step ? 'var(--color-accent)' : 'var(--color-neutral-800)',
              }}
            />
          ))}
        </div>

        {step === 0 && (
          <div>
            <CardKicker>Step 1 of 3</CardKicker>
            <h1 style={{ fontSize: 28, margin: '2px 0 6px' }}>
              Upload your resume
            </h1>
            <p
              className="text-muted"
              style={{ margin: '0 0 20px', fontSize: 14 }}
            >
              We'll parse it, extract your skills, and build a diagnostic test to
              baseline your readiness.
            </p>
            <label
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                padding: 44,
                borderRadius: 14,
                border: '1.5px dashed var(--color-neutral-700)',
                background: 'var(--color-neutral-900)',
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              <FileArrowUp size={34} color="var(--color-accent)" />
              <div style={{ fontSize: 15 }}>
                Drop your resume here{' '}
                <span className="text-muted">or click to browse</span>
              </div>
              <div className="text-muted" style={{ fontSize: 12 }}>
                PDF or DOCX · up to 10 MB
              </div>
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginTop: 14,
                padding: '12px 14px',
                borderRadius: 10,
                background: 'var(--color-surface)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <FilePdf size={20} color="var(--color-accent)" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13 }}>Priya_Menon_Resume.pdf</div>
                <div className="text-muted" style={{ fontSize: 11 }}>
                  Uploaded · 214 KB
                </div>
              </div>
              <CheckCircle size={18} color="var(--color-accent)" />
            </div>
            <Button
              block
              style={{ marginTop: 20 }}
              onClick={() => setStep(1)}
            >
              Continue
            </Button>
          </div>
        )}

        {step === 1 && (
          <div>
            <CardKicker>Step 2 of 3</CardKicker>
            <h1 style={{ fontSize: 28, margin: '2px 0 6px' }}>
              Take your diagnostic mock test
            </h1>
            <p
              className="text-muted"
              style={{ margin: '0 0 16px', fontSize: 14 }}
            >
              From the skills in your resume we assembled these{' '}
              <strong style={{ color: 'var(--color-accent-200)' }}>
                50 questions
              </strong>
              . You don't have to take it now — but your roadmap and skill-gap
              report can't be curated until you do.
            </p>
            <Card
              elev="sm"
              style={{ padding: 0, marginBottom: 14, overflow: 'hidden' }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '15px 18px',
                  boxShadow: 'inset 0 -1px 0 var(--color-divider)',
                }}
              >
                <span className="card-title" style={{ fontSize: 15 }}>
                  All 50 questions
                </span>
                <Tag variant="accent">~40 min</Tag>
              </div>
              <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                {bank.map((q, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      gap: 12,
                      padding: '11px 18px',
                      boxShadow: 'inset 0 -1px 0 var(--color-divider)',
                    }}
                  >
                    <span
                      style={{
                        flex: 'none',
                        width: 24,
                        fontSize: 12,
                        color: 'var(--color-neutral-500)',
                        paddingTop: 2,
                      }}
                    >
                      {i + 1}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13.5, lineHeight: 1.45 }}>
                        {q.q}
                      </div>
                      <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                        <Tag variant="neutral">{q.area}</Tag>
                        <Tag variant="outline">{q.level}</Tag>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                padding: '12px 14px',
                borderRadius: 10,
                background: 'var(--color-accent-900)',
                boxShadow: 'inset 0 0 0 1px var(--color-accent-700)',
                marginBottom: 16,
                fontSize: 13,
              }}
            >
              <Info size={16} color="var(--color-accent)" />
              Complete this diagnostic to curate your roadmap and skill-gap
              report.
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <Button variant="secondary" onClick={() => setStep(0)}>
                Back
              </Button>
              <Button variant="secondary" onClick={() => setStep(2)}>
                I'll take it later
              </Button>
              <Button
                style={{ flex: 1 }}
                onClick={() => navigate('/onboarding/diagnostic')}
              >
                <Play size={16} />
                Take diagnostic now
              </Button>
            </div>
          </div>
        )}

        {step === 2 && diagTaken && (
          <div style={{ textAlign: 'center', paddingTop: 8 }}>
            <div
              style={{
                width: 64,
                height: 64,
                margin: '0 auto 18px',
                borderRadius: '50%',
                background: 'var(--color-accent-900)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'inset 0 0 0 1px var(--color-accent-700)',
              }}
            >
              <CheckCircle size={30} color="var(--color-accent)" />
            </div>
            <CardKicker>Step 3 of 3 · Plan curated</CardKicker>
            <h1 style={{ fontSize: 28, margin: '2px 0 8px' }}>
              Your plan is ready
            </h1>
            <p
              className="text-muted"
              style={{ margin: '0 auto 22px', fontSize: 14, maxWidth: 460 }}
            >
              From your 50-question diagnostic we scored 14 matching skills and{' '}
              {gapCount} gaps, and built your roadmap. Starting readiness{' '}
              <strong style={{ color: 'var(--color-accent-200)' }}>68</strong>.
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
                textAlign: 'left',
                margin: '0 auto 22px',
                maxWidth: 540,
              }}
            >
              <Card elev="sm" style={{ padding: 15 }}>
                <CardKicker>Skill gaps identified</CardKicker>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 6,
                    marginTop: 9,
                  }}
                >
                  {profile?.gapTags.map((g) => (
                    <Tag key={g} variant="outline">
                      {g}
                    </Tag>
                  ))}
                </div>
              </Card>
              <Card elev="sm" style={{ padding: 15 }}>
                <CardKicker>Roadmap created</CardKicker>
                <div
                  style={{
                    marginTop: 9,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 5,
                  }}
                >
                  {phases.map((p) => (
                    <span
                      key={p.name}
                      style={{
                        fontSize: 12.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 7,
                      }}
                    >
                      <DotOutline size={16} color="var(--color-accent)" />
                      {p.name}
                    </span>
                  ))}
                </div>
              </Card>
            </div>
            <Button
              onClick={() => {
                completeOnboarding()
                navigate('/')
              }}
            >
              Go to my dashboard
            </Button>
          </div>
        )}

        {step === 2 && !diagTaken && (
          <div style={{ textAlign: 'center', paddingTop: 20 }}>
            <div
              style={{
                width: 64,
                height: 64,
                margin: '0 auto 18px',
                borderRadius: '50%',
                background: 'var(--color-neutral-900)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'inset 0 0 0 1px var(--color-neutral-700)',
              }}
            >
              <LockSimple size={28} color="var(--color-neutral-400)" />
            </div>
            <CardKicker>Step 3 of 3</CardKicker>
            <h1 style={{ fontSize: 28, margin: '2px 0 8px' }}>
              Your plan isn't curated yet
            </h1>
            <p
              className="text-muted"
              style={{ margin: '0 auto 22px', fontSize: 14, maxWidth: 460 }}
            >
              We can't build your roadmap or skill-gap report until you complete
              the 50-question diagnostic.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <Button variant="secondary" onClick={() => setStep(1)}>
                Back to the test
              </Button>
              <Button onClick={() => navigate('/onboarding/diagnostic')}>
                <Play size={16} />
                Take diagnostic now
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

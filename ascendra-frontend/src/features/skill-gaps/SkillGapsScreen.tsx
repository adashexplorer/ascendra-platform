import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { ArrowSquareOut, CheckCircle, WarningCircle } from '@phosphor-icons/react'
import {
  Button,
  Card,
  CardKicker,
  CardTitle,
  MeterBar,
  Tag,
} from '../../components/ui'
import { getProfile } from '../../services/profile'
import { usePrepStore } from '../../stores/prepStore'
import type { Profile } from '../../types'

const STRENGTHS = [
  'Selenium / Playwright',
  'API test automation',
  'CI/CD (Jenkins)',
  'Java · Python',
  'Agile QA lead',
]

export function SkillGapsScreen() {
  const navigate = useNavigate()
  const extraGaps = usePrepStore((s) => s.extraGaps)
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    let live = true
    getProfile().then((p) => {
      if (live) setProfile(p)
    })
    return () => {
      live = false
    }
  }, [])

  if (!profile) return null

  const gapTags = [
    ...profile.gapTags,
    ...extraGaps.map((g) => ({ label: g.short, res: g.res, url: g.url })),
  ]
  const gapCount = gapTags.length

  return (
    <div>
      <h1 style={{ fontSize: 28, margin: '0 0 4px' }}>Skill-gap analysis</h1>
      <p className="text-muted" style={{ margin: '0 0 22px', fontSize: 14 }}>
        Parsed from <strong>Priya_Menon_Resume.pdf</strong> and matched against
        your target-level requirements.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 14,
          marginBottom: 20,
        }}
      >
        <Card elev="sm" style={{ padding: 16 }}>
          <CardKicker>Matched skills</CardKicker>
          <div style={{ fontSize: 30, fontFamily: 'var(--font-heading)' }}>14</div>
          <p className="text-muted" style={{ fontSize: 12, margin: 0 }}>
            Evidenced in your resume
          </p>
        </Card>
        <Card elev="sm" style={{ padding: 16 }}>
          <CardKicker>Gaps identified</CardKicker>
          <div style={{ fontSize: 30, fontFamily: 'var(--font-heading)' }}>
            {gapCount}
          </div>
          <p className="text-muted" style={{ fontSize: 12, margin: 0 }}>
            Below target for this role
          </p>
        </Card>
        <Card elev="sm" style={{ padding: 16 }}>
          <CardKicker>Est. time to target</CardKicker>
          <div style={{ fontSize: 30, fontFamily: 'var(--font-heading)' }}>
            9<span style={{ fontSize: 15, color: 'var(--color-neutral-500)' }}> wks</span>
          </div>
          <p className="text-muted" style={{ fontSize: 12, margin: 0 }}>
            At current pace
          </p>
        </Card>
      </div>

      <Card elev="sm" style={{ padding: 20, marginBottom: 16 }}>
        <CardTitle>Competency vs. target</CardTitle>
        <div style={{ marginTop: 16 }}>
          {profile.comps.map((c) => (
            <div key={c.name} style={{ marginBottom: 15 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 13,
                  marginBottom: 7,
                }}
              >
                <span>{c.name}</span>
                <span className="text-muted">
                  {c.level} / {c.target}
                </span>
              </div>
              <MeterBar value={c.level} target={c.target} />
            </div>
          ))}
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card elev="sm" style={{ padding: 20 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 12,
            }}
          >
            <CheckCircle size={17} color="var(--color-accent)" />
            <CardTitle style={{ fontSize: 15 }}>Strengths on your resume</CardTitle>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {STRENGTHS.map((s) => (
              <Tag key={s} variant="accent">
                {s}
              </Tag>
            ))}
          </div>
        </Card>
        <Card elev="sm" style={{ padding: 20 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 12,
            }}
          >
            <WarningCircle size={17} color="var(--color-neutral-400)" />
            <CardTitle style={{ fontSize: 15 }}>Priority gaps to close</CardTitle>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {gapTags.map((g) => (
              <a
                key={g.label}
                className="asc-res"
                href={g.url}
                target="_blank"
                rel="noopener"
                title="Open resource in a new tab"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 0',
                  boxShadow: 'inset 0 -1px 0 var(--color-divider)',
                }}
              >
                <Tag variant="outline" style={{ flex: 'none' }}>
                  {g.label}
                </Tag>
                <span
                  className="asc-res-lnk"
                  style={{
                    marginLeft: 'auto',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    fontSize: 12,
                    color: 'var(--color-accent)',
                  }}
                >
                  {g.res}
                  <ArrowSquareOut size={14} />
                </span>
              </a>
            ))}
          </div>
          <p className="text-muted" style={{ fontSize: 11, margin: '12px 0 0' }}>
            Updated automatically as mock interviews surface new weaknesses.
          </p>
          <div style={{ marginTop: 12 }}>
            <Button variant="primary" onClick={() => navigate('/roadmap')}>
              Generate roadmap from gaps
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

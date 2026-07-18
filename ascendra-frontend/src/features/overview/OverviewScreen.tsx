import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { ArrowUpRight, Brain, DotOutline, Play, SunHorizon } from '@phosphor-icons/react'
import {
  Button,
  Card,
  CardBody,
  CardKicker,
  CardTitle,
  MeterBar,
  ProgressRing,
  Tag,
} from '../../components/ui'
import { getProfile } from '../../services/profile'
import { usePrepStore } from '../../stores/prepStore'
import { useAuthStore } from '../../stores/authStore'
import type { Profile } from '../../types'

function greetingFor(hour: number): string {
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function dateLine(now: Date): string {
  const weekday = now.toLocaleDateString('en-US', { weekday: 'long' })
  const month = now.toLocaleDateString('en-US', { month: 'long' })
  return `${weekday}, ${now.getDate()} ${month} — Day 47 of your plan`
}

const GRID: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1.35fr 1fr',
  gap: 16,
}

export function OverviewScreen() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<Profile | null>(null)
  const readiness = usePrepStore((s) => s.readiness)
  const target = usePrepStore((s) => s.target)
  const delta = usePrepStore((s) => s.delta)
  const extraGaps = usePrepStore((s) => s.extraGaps)
  const user = useAuthStore((s) => s.user)

  useEffect(() => {
    let cancelled = false
    getProfile().then((p) => {
      if (!cancelled) setProfile(p)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const now = new Date()
  const firstName = (user?.name ?? 'Priya').split(/\s+/)[0]
  const weak = [...(profile?.weak ?? []), ...extraGaps.map((g) => g.long)]

  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 32, margin: '0 0 4px' }}>
          {greetingFor(now.getHours())}, {firstName}
        </h1>
        <p className="text-muted" style={{ margin: 0, fontSize: 14 }}>
          {dateLine(now)}
        </p>
      </div>

      <div style={GRID}>
        {/* Readiness card */}
        <Card
          elev="sm"
          hover
          style={{
            padding: 22,
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: 24,
            alignItems: 'center',
          }}
        >
          <ProgressRing value={readiness} size={132} label="Readiness" />
          <div>
            <CardKicker>Interview readiness</CardKicker>
            <div style={{ fontSize: 15, margin: '4px 0 10px' }}>
              On track toward your target readiness of <strong>{target}</strong>. Keep the
              daily loop going to close your gaps.
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 13,
                color: 'var(--color-accent-200)',
              }}
            >
              <ArrowUpRight />
              {delta}
            </div>
            <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
              <Button variant="primary" onClick={() => navigate('/interview')}>
                Start a mock loop
              </Button>
              <Button variant="secondary" onClick={() => navigate('/roadmap')}>
                View roadmap
              </Button>
            </div>
          </div>
        </Card>

        {/* Today's drill card */}
        <Card elev="sm" hover style={{ padding: 20, justifyContent: 'space-between' }}>
          <div>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}
            >
              <SunHorizon size={18} color="var(--color-accent)" />
              <CardTitle>Today's 10 questions</CardTitle>
            </div>
            <CardBody style={{ opacity: 0.75 }}>
              Ten questions picked from your weakest areas — concurrency, test design and
              system design. ~15 min.
            </CardBody>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
              <Tag variant="accent">Concurrency ×3</Tag>
              <Tag variant="neutral">Test Strategy ×3</Tag>
              <Tag variant="neutral">System Design ×2</Tag>
              <Tag variant="neutral">Behavioral ×2</Tag>
            </div>
          </div>
          <Button variant="primary" block onClick={() => navigate('/drill')}>
            <Play />
            Begin drill
          </Button>
        </Card>
      </div>

      <div style={{ ...GRID, marginTop: 16 }}>
        {/* Competency breakdown */}
        <Card elev="sm" style={{ padding: 20 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}
          >
            <CardTitle>Competency breakdown</CardTitle>
            <Button variant="ghost" onClick={() => navigate('/gaps')}>
              Full report →
            </Button>
          </div>
          {(profile?.comps ?? []).map((c) => (
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
          <p className="text-muted" style={{ fontSize: 11, margin: '4px 0 0' }}>
            Marker shows the target level for this role.
          </p>
        </Card>

        {/* Right rail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card elev="sm" style={{ padding: 18 }}>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}
            >
              <Brain size={17} color="var(--color-accent)" />
              <CardTitle style={{ fontSize: 15 }}>Focus areas</CardTitle>
            </div>
            {weak.map((w) => (
              <div
                key={w}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 9,
                  padding: '7px 0',
                  fontSize: 13,
                  borderBottom: '1px solid var(--color-divider)',
                }}
              >
                <DotOutline color="var(--color-accent)" />
                {w}
              </div>
            ))}
            <p className="text-muted" style={{ fontSize: 11, margin: '10px 0 0' }}>
              Carried forward from your last sessions.
            </p>
          </Card>

          <Card elev="sm" hover style={{ padding: 18 }}>
            <CardKicker>Next up</CardKicker>
            <CardTitle style={{ fontSize: 16 }}>Mock loop · Friday 9:00</CardTitle>
            <CardBody style={{ opacity: 0.72 }}>
              4 rounds: coding, test design, system design, behavioral.
            </CardBody>
            <Button
              variant="secondary"
              style={{ alignSelf: 'flex-start' }}
              onClick={() => navigate('/interview')}
            >
              Preview session
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { ArrowsOut, PaperPlaneRight, Sparkle, X } from '@phosphor-icons/react'
import { Button, Chip, Input } from '../../components/ui'
import { cx } from '../../components/ui/cx'
import { useUiStore } from '../../stores/uiStore'
import { usePrepStore } from '../../stores/prepStore'

const CANNED_REPLY = "I'm a demo guide — try one of the quick actions below."

interface ChatMessage {
  from: 'agent' | 'user'
  text: string
}

const bubbleBase: CSSProperties = {
  maxWidth: '88%',
  padding: '11px 14px',
  fontSize: '13.5px',
  lineHeight: 1.5,
}

const agentBubble: CSSProperties = {
  ...bubbleBase,
  alignSelf: 'flex-start',
  borderRadius: '14px 14px 14px 4px',
  background: 'var(--color-neutral-900)',
}

const userBubble: CSSProperties = {
  ...bubbleBase,
  alignSelf: 'flex-end',
  borderRadius: '14px 14px 4px 14px',
  background: 'var(--color-accent-800)',
  color: 'var(--color-accent-100)',
}

export function ChatAgent() {
  const navigate = useNavigate()
  const chatOpen = useUiStore((s) => s.chatOpen)
  const chatExpanded = useUiStore((s) => s.chatExpanded)
  const openChat = useUiStore((s) => s.openChat)
  const closeChat = useUiStore((s) => s.closeChat)
  const toggleExpand = useUiStore((s) => s.toggleExpand)
  const readiness = usePrepStore((s) => s.readiness)

  const [draft, setDraft] = useState('')
  const [extraMessages, setExtraMessages] = useState<ChatMessage[]>([])
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }, [extraMessages, chatOpen])

  if (!chatOpen) {
    return (
      <button
        type="button"
        onClick={openChat}
        style={{
          position: 'fixed',
          right: 22,
          bottom: 22,
          zIndex: 55,
          display: 'flex',
          alignItems: 'center',
          gap: 9,
          padding: '12px 18px',
          borderRadius: 999,
          border: '1px solid var(--color-accent)',
          background: 'var(--color-surface)',
          color: 'var(--color-accent)',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-md)',
          font: 'inherit',
          fontSize: 14,
        }}
      >
        <Sparkle size={18} />
        Ask Ascendra
      </button>
    )
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    setExtraMessages((msgs) => [
      ...msgs,
      { from: 'user', text },
      { from: 'agent', text: CANNED_REPLY },
    ])
    setDraft('')
  }

  return (
    <div className={cx('asc-chat', chatExpanded && 'asc-chat-exp')}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '14px 16px',
          boxShadow: 'inset 0 -1px 0 var(--color-divider)',
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-bg)',
          }}
        >
          <Sparkle size={16} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 500 }}>Ascendra guide</div>
          <div style={{ fontSize: 11, color: 'var(--color-accent-200)' }}>
            ● Online · knows your plan
          </div>
        </div>
        <Button variant="secondary" icon title="Expand" aria-label="Expand" onClick={toggleExpand}>
          <ArrowsOut size={18} />
        </Button>
        <Button variant="secondary" icon title="Close" aria-label="Close" onClick={closeChat}>
          <X size={18} />
        </Button>
      </div>

      <div
        ref={bodyRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div style={agentBubble}>
          Morning, Priya. Your readiness is{' '}
          <strong style={{ color: 'var(--color-accent-200)' }}>{readiness}</strong> — up 6 this
          week. Today's 10 questions target concurrency and test design, your two weakest areas.
          Want to start?
        </div>
        <div style={userBubble}>What should I focus on before my next mock loop?</div>
        <div style={agentBubble}>
          System design is your biggest gap (54/80). I'd do the{' '}
          <strong>Distributed testing at scale</strong> module next, then a mock loop Friday. I've
          pinned it to the top of your roadmap.
        </div>
        {extraMessages.map((m, i) => (
          <div key={i} style={m.from === 'agent' ? agentBubble : userBubble}>
            {m.text}
          </div>
        ))}
      </div>

      <div style={{ padding: '12px 14px', boxShadow: 'inset 0 1px 0 var(--color-divider)' }}>
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 10 }}>
          <Chip onClick={() => navigate('/drill')}>Start today's drill</Chip>
          <Chip onClick={() => navigate('/gaps')}>Explain my weakest area</Chip>
          <Chip onClick={() => navigate('/interview')}>Schedule a mock</Chip>
        </div>
        <form onSubmit={submit} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Input
            placeholder="Ask anything about your prep…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            style={{ flex: 1 }}
          />
          <Button variant="primary" icon type="submit" title="Send" aria-label="Send" style={{ flex: 'none' }}>
            <PaperPlaneRight size={18} />
          </Button>
        </form>
      </div>
    </div>
  )
}

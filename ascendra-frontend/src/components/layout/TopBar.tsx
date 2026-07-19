import { useNavigate } from 'react-router'
import { NotePencil, Sparkle, SunHorizon } from '@phosphor-icons/react'
import { Chip, ThemeToggle } from '../ui'
import { useUiStore } from '../../stores/uiStore'

export function TopBar() {
  const navigate = useNavigate()
  const openChat = useUiStore((s) => s.openChat)
  const notesOpen = useUiStore((s) => s.notesOpen)
  const toggleNotes = useUiStore((s) => s.toggleNotes)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 10,
        marginBottom: 26,
      }}
    >
      <ThemeToggle />
      <Chip on={notesOpen} onClick={toggleNotes}>
        <NotePencil size={16} />
        Notes &amp; TODOs
      </Chip>
      <Chip onClick={() => navigate('/drill')}>
        <SunHorizon size={16} />
        Today's 10
      </Chip>
      <Chip onClick={openChat}>
        <Sparkle size={16} color="var(--color-accent)" />
        Ask Ascendra
      </Chip>
    </div>
  )
}

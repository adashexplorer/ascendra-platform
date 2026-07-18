import { useNavigate } from 'react-router'
import { Sparkle, SunHorizon } from '@phosphor-icons/react'
import { Chip, ThemeToggle } from '../ui'
import { useUiStore } from '../../stores/uiStore'

export function TopBar() {
  const navigate = useNavigate()
  const openChat = useUiStore((s) => s.openChat)

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

import { Moon, Sun } from '@phosphor-icons/react'
import { useThemeStore } from '../../stores/themeStore'
import { Button } from './Button'
import type { ButtonProps } from './Button'

export interface ThemeToggleProps
  extends Omit<ButtonProps, 'variant' | 'icon' | 'children'> {}

/** Icon button that flips the app theme via the theme store. */
export function ThemeToggle(props: ThemeToggleProps) {
  const theme = useThemeStore((s) => s.theme)
  const toggle = useThemeStore((s) => s.toggle)
  const title =
    theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'

  return (
    <Button
      variant="secondary"
      icon
      title={title}
      aria-label={title}
      onClick={toggle}
      {...props}
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </Button>
  )
}

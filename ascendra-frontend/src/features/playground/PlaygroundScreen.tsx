import { useState } from 'react'
import { ArrowSquareOut } from '@phosphor-icons/react'
import { Card, Chip } from '../../components/ui'
import { useThemeStore } from '../../stores/themeStore'

type Lang = 'java' | 'python' | 'javascript' | 'cpp'

const LANGS: { id: Lang; label: string }[] = [
  { id: 'java', label: 'Java' },
  { id: 'python', label: 'Python' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'cpp', label: 'C++' },
]

export function PlaygroundScreen() {
  const [lang, setLang] = useState<Lang>('java')
  const theme = useThemeStore((s) => s.theme)

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 4,
        }}
      >
        <h1 style={{ fontSize: 28, margin: 0 }}>Coding playground</h1>
        <a
          className="asc-chip"
          style={{ textDecoration: 'none' }}
          href="https://codesandbox.io/s/new"
          target="_blank"
          rel="noopener"
        >
          <ArrowSquareOut size={16} />
          Open full CodeSandbox
        </a>
      </div>
      <p className="text-muted" style={{ margin: '0 0 16px', fontSize: 14 }}>
        Write and run code without leaving your prep. Pick a language below — for
        multi-file projects, open CodeSandbox in a new tab.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        {LANGS.map(({ id, label }) => (
          <Chip key={id} on={lang === id} onClick={() => setLang(id)}>
            {label}
          </Chip>
        ))}
      </div>

      <Card elev="sm" style={{ padding: 0, overflow: 'hidden' }}>
        <iframe
          key={`${lang}-${theme}`}
          title="Coding playground"
          src={`https://onecompiler.com/embed/${lang}?theme=${theme}&hideNew=true`}
          style={{ width: '100%', height: 620, border: 'none', display: 'block' }}
        />
      </Card>
    </div>
  )
}

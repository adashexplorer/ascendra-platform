import { useState } from 'react'
import {
  CheckCircle,
  CheckSquare,
  NotePencil,
  Plus,
  Square,
  X,
} from '@phosphor-icons/react'
import { Button, CardKicker, CardTitle, Input, Textarea } from '../../components/ui'
import { useUiStore } from '../../stores/uiStore'
import { useNotesStore } from '../../stores/notesStore'

export function NotesPanel() {
  const toggleNotes = useUiStore((s) => s.toggleNotes)
  const notes = useNotesStore((s) => s.notes)
  const todos = useNotesStore((s) => s.todos)
  const setNotes = useNotesStore((s) => s.setNotes)
  const addTodo = useNotesStore((s) => s.addTodo)
  const toggleTodo = useNotesStore((s) => s.toggleTodo)
  const removeTodo = useNotesStore((s) => s.removeTodo)

  const [draft, setDraft] = useState('')

  const submitTodo = () => {
    if (!draft.trim()) return
    addTodo(draft)
    setDraft('')
  }

  return (
    <aside
      style={{
        width: 296,
        flex: 'none',
        background: 'var(--color-surface)',
        boxShadow: '-1px 0 0 var(--color-divider)',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
        padding: '20px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 22,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <NotePencil size={18} color="var(--color-accent)" />
        <CardTitle style={{ flex: 1, fontSize: 15 }}>Notes &amp; TODOs</CardTitle>
        <Button
          variant="ghost"
          icon
          title="Close panel"
          onClick={toggleNotes}
        >
          <X size={16} />
        </Button>
      </div>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <CardKicker>My notes</CardKicker>
        <Textarea
          placeholder="Jot down concepts, mistakes to avoid, links…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={{ minHeight: 150, fontSize: 13, lineHeight: 1.5 }}
        />
        <div
          className="text-muted"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 11,
          }}
        >
          <CheckCircle size={13} color="var(--color-accent)" />
          Saved automatically — here whenever you return.
        </div>
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <CardKicker>TODOs</CardKicker>
        <div style={{ display: 'flex', gap: 8 }}>
          <Input
            placeholder="Add a TODO…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submitTodo()
            }}
            style={{ flex: 1, minWidth: 0 }}
          />
          <Button variant="primary" icon title="Add TODO" onClick={submitTodo}>
            <Plus size={16} />
          </Button>
        </div>
        {todos.length === 0 ? (
          <div className="text-muted" style={{ fontSize: 12 }}>
            Nothing yet — add prep tasks above.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {todos.map((todo, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 0',
                  borderBottom: '1px solid var(--color-divider)',
                }}
              >
                <Button
                  variant="ghost"
                  icon
                  title={todo.done ? 'Mark as not done' : 'Mark as done'}
                  onClick={() => toggleTodo(i)}
                  style={{ width: 28, height: 28, flex: 'none' }}
                >
                  {todo.done ? (
                    <CheckSquare size={17} color="var(--color-accent)" />
                  ) : (
                    <Square size={17} color="var(--color-accent)" />
                  )}
                </Button>
                <span
                  className={todo.done ? 'asc-todo-done' : undefined}
                  style={{ flex: 1, minWidth: 0, fontSize: 13 }}
                >
                  {todo.text}
                </span>
                <Button
                  variant="ghost"
                  icon
                  title="Delete TODO"
                  onClick={() => removeTodo(i)}
                  style={{ width: 28, height: 28, flex: 'none' }}
                >
                  <X size={13} color="var(--color-neutral-500)" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>
    </aside>
  )
}

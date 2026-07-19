import { create } from 'zustand'
import type { TodoItem } from '../types'

const NOTES_KEY = 'asc-notes'
const TODOS_KEY = 'asc-todos'

/**
 * Persistence note: the prototype stores notes as a RAW string under
 * `asc-notes` and todos as a BARE JSON array under `asc-todos`. Zustand's
 * `persist` middleware would wrap values in a `{ state, version }` envelope,
 * so this store does plain manual localStorage read/write instead — the two
 * keys hold exactly the prototype's shapes.
 */
function loadNotes(): string {
  try {
    return localStorage.getItem(NOTES_KEY) ?? ''
  } catch {
    return ''
  }
}

function loadTodos(): TodoItem[] {
  try {
    const raw = localStorage.getItem(TODOS_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as TodoItem[]) : []
  } catch {
    return []
  }
}

function saveNotes(notes: string) {
  try {
    localStorage.setItem(NOTES_KEY, notes)
  } catch {
    /* storage unavailable — keep in-memory state */
  }
}

function saveTodos(todos: TodoItem[]) {
  try {
    localStorage.setItem(TODOS_KEY, JSON.stringify(todos))
  } catch {
    /* storage unavailable — keep in-memory state */
  }
}

interface NotesState {
  notes: string
  todos: TodoItem[]
  setNotes: (text: string) => void
  addTodo: (text: string) => void
  toggleTodo: (index: number) => void
  removeTodo: (index: number) => void
}

export const useNotesStore = create<NotesState>()((set) => ({
  notes: loadNotes(),
  todos: loadTodos(),
  setNotes: (text) =>
    set(() => {
      saveNotes(text)
      return { notes: text }
    }),
  addTodo: (text) =>
    set((s) => {
      const trimmed = text.trim()
      if (!trimmed) return s
      const todos = [...s.todos, { text: trimmed, done: false }]
      saveTodos(todos)
      return { todos }
    }),
  toggleTodo: (index) =>
    set((s) => {
      const todos = s.todos.map((t, i) =>
        i === index ? { ...t, done: !t.done } : t,
      )
      saveTodos(todos)
      return { todos }
    }),
  removeTodo: (index) =>
    set((s) => {
      const todos = s.todos.filter((_, i) => i !== index)
      saveTodos(todos)
      return { todos }
    }),
}))

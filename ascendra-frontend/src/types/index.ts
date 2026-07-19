export interface Competency {
  name: string
  level: number
  target: number
}

export interface GapTag {
  label: string
  res: string
  url: string
}

export interface Profile {
  readiness: number
  target: number
  delta: string
  comps: Competency[]
  weak: string[]
  gapTags: GapTag[]
}

export interface PhaseModule {
  name: string
  res: string
  url: string
}

export interface Phase {
  name: string
  weeks: string
  status: string
  state: 'done' | 'active' | 'next'
  modules: PhaseModule[]
}

export type QuestionLevel = 'Beginner' | 'Intermediate' | 'Advanced'

export interface DrillQuestion {
  area: string
  q: string
}

export interface InterviewQuestion {
  area: string
  level: QuestionLevel
  q: string
}

export interface DiagnosticQuestion {
  area: string
  level: QuestionLevel
  q: string
}

export interface CodingQuestion {
  area: string
  level: QuestionLevel
  q: string
}

export interface GapItem {
  short: string
  long: string
  res: string
  url: string
}

export interface TrendPoint {
  month: string
  value: number
}

export interface SessionRecord {
  date: string
  kind: string
  score: string
  focus: string
}

export interface TodoItem {
  text: string
  done: boolean
}

export interface User {
  name: string
  email: string
  initials: string
  plan: string
}

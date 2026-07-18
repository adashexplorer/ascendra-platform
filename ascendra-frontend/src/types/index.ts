export interface Competency {
  name: string
  level: number
  target: number
}

export interface Profile {
  readiness: number
  target: number
  delta: string
  comps: Competency[]
  weak: string[]
  gapTags: string[]
}

export interface Phase {
  name: string
  weeks: string
  status: string
  state: 'done' | 'active' | 'next'
  modules: string[]
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

export interface GapItem {
  short: string
  long: string
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

export interface User {
  name: string
  email: string
  initials: string
  plan: string
}

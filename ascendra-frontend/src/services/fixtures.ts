import type {
  DiagnosticQuestion,
  DrillQuestion,
  GapItem,
  InterviewQuestion,
  Phase,
  Profile,
  SessionRecord,
} from '../types'

// All fixture data lifted verbatim from the prototype:
// design/nocturne/prototype/Ascendra.dc.html

export const PROFILE: Profile = {
  readiness: 68,
  delta: '+6 pts this week',
  target: 85,
  comps: [
    { name: 'Coding & DSA', level: 72, target: 85 },
    { name: 'Test Strategy & Automation', level: 63, target: 88 },
    { name: 'System Design', level: 54, target: 80 },
    { name: 'CS Fundamentals', level: 66, target: 78 },
    { name: 'Behavioral & Communication', level: 70, target: 82 },
  ],
  weak: [
    'Concurrency & thread safety',
    'Distributed system trade-offs',
    'STAR structure in behavioral answers',
    'Test design for edge cases',
  ],
  gapTags: [
    'Distributed systems',
    'System design depth',
    'Concurrency',
    'Scale-testing',
    'Behavioral depth',
  ],
}

export const PHASES: Phase[] = [
  {
    name: 'Phase 1 · Foundations',
    weeks: 'Weeks 1–3',
    status: 'Complete',
    state: 'done',
    modules: ['DSA refresher', 'Language & tooling baseline', 'Resume-mapped diagnostic test'],
  },
  {
    name: 'Phase 2 · Test Engineering Depth',
    weeks: 'Weeks 4–7',
    status: 'In progress',
    state: 'active',
    modules: ['Test strategy & the test pyramid', 'Automation framework design', 'Concurrency & flaky-test debugging'],
  },
  {
    name: 'Phase 3 · Distributed Systems & Design',
    weeks: 'Weeks 8–11',
    status: 'Upcoming',
    state: 'next',
    modules: ['Distributed testing at scale', 'Design for testability', 'Observability & fault injection'],
  },
  {
    name: 'Phase 4 · Interview Simulation',
    weeks: 'Weeks 12–14',
    status: 'Upcoming',
    state: 'next',
    modules: ['Behavioral leadership loop', 'Full mock loop ×3', 'Readiness gate ≥ 85'],
  },
]

export const DRILL: DrillQuestion[] = [
  { area: 'Test Strategy', q: 'Design a test strategy for a payment service handling 50k requests/second. What layers matter most?' },
  { area: 'Concurrency', q: 'What is a race condition? Give a concrete example and describe a test that reliably catches it.' },
  { area: 'System Design', q: 'How would you verify correctness of a distributed rate limiter under network partitions?' },
  { area: 'Automation', q: 'Your CI has 4% flaky tests. Walk through how you would detect, quarantine, and fix them.' },
  { area: 'Behavioral', q: 'Tell me about a time you disagreed with a senior engineer on quality. (Structure with STAR.)' },
  { area: 'Coding', q: 'Given a stream of events, design a sliding-window rate counter. Discuss time/space complexity.' },
  { area: 'Edge Cases', q: 'Enumerate edge cases you would test for a file-upload API accepting up to 5 GB.' },
  { area: 'CS Fundamentals', q: 'Explain how a hash map degrades to O(n) and how you would test for that in practice.' },
  { area: 'System Design', q: 'How do you test idempotency of a retryable “create order” endpoint?' },
  { area: 'Behavioral', q: 'Describe a bug that reached production. What did you change in your process afterward?' },
]

// Mock-interview questions are always drawn from the candidate's skill-gap areas, tagged by level.
export const IVPOOL: InterviewQuestion[] = [
  { area: 'Test Strategy', level: 'Beginner', q: 'Explain the test pyramid and where an SDET should concentrate effort.' },
  { area: 'Concurrency', level: 'Beginner', q: 'What is a race condition? Give a concrete example and how you would surface it in a test.' },
  { area: 'Behavioral', level: 'Beginner', q: 'Tell me about a time you caught a critical bug before release.' },
  { area: 'Test Strategy', level: 'Intermediate', q: 'How do you detect and eliminate flaky tests across a large CI pipeline?' },
  { area: 'System Design', level: 'Intermediate', q: 'How would you test idempotency of a retryable “create order” endpoint?' },
  { area: 'Behavioral · Deliver Results', level: 'Intermediate', q: 'Tell me about improving coverage under a tight deadline — what did you cut and why?' },
  { area: 'System Design', level: 'Advanced', q: 'Walk me through testing a distributed rate limiter. Where does it break under network partitions?' },
  { area: 'Distributed Systems', level: 'Advanced', q: 'How do you verify correctness of a service under network partitions and clock skew?' },
  { area: 'Concurrency', level: 'Advanced', q: 'Design a test that reliably reproduces a deadlock in a shared-cache code path.' },
]

// The 50-question resume-diagnostic bank shown before a plan is curated.
export const DIAG: DiagnosticQuestion[] = [
  { area: 'Automation', level: 'Beginner', q: 'Design a page-object model for a flaky checkout flow.' },
  { area: 'Automation', level: 'Intermediate', q: 'How do you structure an automation framework for parallel execution?' },
  { area: 'Automation', level: 'Beginner', q: 'When do you choose UI automation over API automation?' },
  { area: 'Automation', level: 'Intermediate', q: 'How do you handle test data setup and teardown across a suite?' },
  { area: 'Automation', level: 'Beginner', q: 'Explain the test pyramid and where most SDET effort should sit.' },
  { area: 'Automation', level: 'Intermediate', q: 'How do you make Selenium/Playwright tests resilient to a dynamic DOM?' },
  { area: 'Automation', level: 'Advanced', q: 'Design a retry strategy that does not hide real failures.' },
  { area: 'Automation', level: 'Intermediate', q: 'How do you measure and improve test-suite execution time?' },
  { area: 'Automation', level: 'Advanced', q: 'What makes an automation framework maintainable at 10k tests?' },
  { area: 'Automation', level: 'Intermediate', q: 'How do you report and triage automated failures at scale?' },
  { area: 'API', level: 'Intermediate', q: 'How do you test an idempotent “create order” endpoint?' },
  { area: 'API', level: 'Advanced', q: 'Design contract tests between two microservices.' },
  { area: 'API', level: 'Beginner', q: 'How do you test pagination and rate-limit headers on a REST API?' },
  { area: 'API', level: 'Intermediate', q: 'What is your approach to testing auth and authorization flows?' },
  { area: 'API', level: 'Advanced', q: 'How do you validate backward compatibility of an API change?' },
  { area: 'API', level: 'Intermediate', q: 'How do you test webhooks and async callbacks reliably?' },
  { area: 'API', level: 'Intermediate', q: 'Design negative tests for a file-upload API with a 5 GB limit.' },
  { area: 'API', level: 'Beginner', q: 'How do you mock third-party dependencies in integration tests?' },
  { area: 'Scale & Design', level: 'Advanced', q: 'How would you load-test a service targeting 50k requests/second?' },
  { area: 'Scale & Design', level: 'Advanced', q: 'Design a test strategy for a distributed rate limiter.' },
  { area: 'Scale & Design', level: 'Advanced', q: 'How do you test correctness under network partitions?' },
  { area: 'Scale & Design', level: 'Intermediate', q: 'What metrics define “passing” a performance test?' },
  { area: 'Scale & Design', level: 'Advanced', q: 'How do you design chaos and fault-injection experiments?' },
  { area: 'Scale & Design', level: 'Intermediate', q: 'How do you assert on logs, traces and metrics in tests?' },
  { area: 'Scale & Design', level: 'Advanced', q: 'How do you find the capacity breaking point of a service?' },
  { area: 'Scale & Design', level: 'Intermediate', q: 'Design a soak test and describe what failures it surfaces.' },
  { area: 'Concurrency', level: 'Beginner', q: 'What is a race condition? Give a concrete example.' },
  { area: 'Concurrency', level: 'Advanced', q: 'How do you write a test that reliably reproduces a deadlock?' },
  { area: 'Concurrency', level: 'Intermediate', q: 'Explain thread-safety issues in a shared cache and how to test them.' },
  { area: 'Concurrency', level: 'Advanced', q: 'How do you detect data races in a CI pipeline?' },
  { area: 'Concurrency', level: 'Intermediate', q: 'What synchronization bugs appear only under load?' },
  { area: 'Concurrency', level: 'Advanced', q: 'How do you test an async job queue for exactly-once processing?' },
  { area: 'Concurrency', level: 'Advanced', q: 'Explain the ABA problem and its testing implications.' },
  { area: 'Coding & DSA', level: 'Intermediate', q: 'Implement a sliding-window rate counter; discuss complexity.' },
  { area: 'Coding & DSA', level: 'Beginner', q: 'Detect a cycle in a linked list.' },
  { area: 'Coding & DSA', level: 'Intermediate', q: 'Design an LRU cache and its test cases.' },
  { area: 'Coding & DSA', level: 'Advanced', q: 'Find the k most frequent elements in a stream.' },
  { area: 'Coding & DSA', level: 'Intermediate', q: 'Merge overlapping intervals; enumerate edge cases.' },
  { area: 'Coding & DSA', level: 'Advanced', q: 'Implement a thread-safe bounded blocking queue.' },
  { area: 'Coding & DSA', level: 'Intermediate', q: 'Given logs, compute p95 latency efficiently.' },
  { area: 'CI/CD', level: 'Intermediate', q: 'Design a CI pipeline that gates merges on test health.' },
  { area: 'CI/CD', level: 'Advanced', q: 'How do you quarantine and track flaky tests over time?' },
  { area: 'CI/CD', level: 'Intermediate', q: 'How do you shard tests across CI runners?' },
  { area: 'CI/CD', level: 'Intermediate', q: 'What is your rollback and verification strategy on deploy?' },
  { area: 'CI/CD', level: 'Advanced', q: 'How do you keep pipeline runtime under 10 minutes as tests grow?' },
  { area: 'CI/CD', level: 'Beginner', q: 'How do you manage test environments and secrets safely?' },
  { area: 'Behavioral', level: 'Intermediate', q: 'Tell me about a time you disagreed with a senior engineer on quality.' },
  { area: 'Behavioral', level: 'Intermediate', q: 'Describe a bug that reached production and what you changed afterward.' },
  { area: 'Behavioral', level: 'Beginner', q: 'How do you advocate for quality when timelines slip?' },
  { area: 'Behavioral', level: 'Intermediate', q: 'Tell me about mentoring a junior on test design.' },
]

export const EXTRA_GAPS: GapItem[] = [
  { short: 'Rate-limiter partitions', long: 'Rate-limiter correctness under network partitions' },
  { short: 'Impact metrics', long: 'Quantifying impact in behavioral answers' },
]

export const EXTRA_PHASE: Phase = {
  name: 'Phase 5 · Post-mock reinforcement',
  weeks: 'Weeks 15–16',
  status: 'New',
  state: 'active',
  modules: ['Distributed rate-limiter deep dive', 'Fault-injection testing lab', 'Targeted follow-up mock on weak areas'],
}

export const TREND: number[] = [22, 31, 44, 58, 68]
export const MONTHS: string[] = ['Mar', 'Apr', 'May', 'Jun', 'Jul']

export const HISTORY: SessionRecord[] = [
  { date: 'Jul 12', kind: 'Mock loop · 4 rounds', score: '3.2 / 5', focus: 'System Design' },
  { date: 'Jul 08', kind: 'Daily drill', score: '7 / 10', focus: 'Concurrency' },
  { date: 'Jul 05', kind: 'Behavioral mock', score: '3.6 / 5', focus: 'Leadership Principles' },
  { date: 'Jul 01', kind: 'Daily drill', score: '6 / 10', focus: 'Edge cases' },
]

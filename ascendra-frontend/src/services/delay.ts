/** Simulated network latency for the mock API layer. */
export function delay(ms = 150): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Local validation mirroring the prototype (spec 02 — Data contracts). */

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

export function validateName(name: string): string | undefined {
  if (!name.trim()) return 'Please enter your name.'
  return undefined
}

export function validateEmail(email: string): string | undefined {
  if (!email.trim()) return 'Email is required.'
  if (!EMAIL_RE.test(email.trim())) return 'Enter a valid email address.'
  return undefined
}

export function validatePassword(password: string): string | undefined {
  if (!password) return 'Password is required.'
  if (password.length < 8) return 'Use at least 8 characters.'
  return undefined
}

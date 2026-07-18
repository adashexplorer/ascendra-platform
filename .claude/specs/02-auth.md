# Spec 02 — Auth (login / register)

## Purpose

Gate the platform. Sign in for returning users; registration routes new users
into onboarding. Pure client-side demo auth (any valid input accepted).

## Route & navigation

- `/login`, `/register` under a shared `AuthLayout`: full-viewport centered
  column (`min-height:100vh`, bg `--color-bg`), content max-width 392px.
- Theme toggle icon button absolutely positioned top-right of the column.
- If already authed → redirect `/`.
- On successful login → `/` (guard bounces to `/onboarding` if `!onboarded`).
  On successful register → `/onboarding`.

## Data contracts

- `authStore.login(email)`, `authStore.register(name, email)`. Register sets `onboarded: false`.
- Validation (local, mirrors prototype): name required (register only);
  email required + `/^[^@\s]+@[^@\s]+\.[^@\s]+$/`; password required, ≥ 8 chars.
  Error copy: "Please enter your name." / "Email is required." /
  "Enter a valid email address." / "Password is required." / "Use at least 8 characters."

## UI layout

Brand row centered above the card: 30px rounded-8 accent square with `Compass`
icon (color `--color-bg`) + "Ascendra" 21px/600 heading font.

Card (`elev="md"`, padding 28):

**Login**: h1 "Welcome back" (23px), muted sub "Sign in to continue your interview prep."
Fields: Email (placeholder `priya@example.com`), Password (placeholder `••••••••`).
Primary block Button "Sign in". Footer muted 13px: "No account yet? *Create one*"
(link-style button → `/register`).

**Register**: h1 "Create your account", sub "Sign up and we'll baseline you with
a resume-based diagnostic." Fields: Full name (placeholder `Priya Menon`), Email,
Password (placeholder "At least 8 characters"). Primary block Button
"Create account". Footer: "Already have an account? *Sign in*".

Errors render via `Field error=` (red border on input + 11.5px red message).

## States & interactions

- Submit with invalid fields → show per-field errors, no navigation. Typing in a field clears its error.
- Switching login/register clears errors.
- Enter key submits the form.

## Acceptance checklist

- [ ] Empty submit on /login shows both field errors; bad email shows format error.
- [ ] Valid login lands on Overview (existing demo user) — user card shows initials + name.
- [ ] Register (any valid values) lands on /onboarding.
- [ ] Auth state survives reload (localStorage); /login redirects to / when authed.
- [ ] Both themes render correctly; theme toggle works on the auth screen.

import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { Button, Field, Input } from '../../components/ui'
import { useAuthStore } from '../../stores/authStore'
import { AuthLayout } from './AuthLayout'
import { validateEmail, validatePassword } from './validation'

interface LoginErrors {
  email?: string
  password?: string
}

export function LoginScreen() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<LoginErrors>({})

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const next: LoginErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
    }
    if (next.email || next.password) {
      setErrors(next)
      return
    }
    login(email.trim())
    navigate('/')
  }

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} noValidate>
        <h1 style={{ fontSize: 23, margin: '0 0 4px' }}>Welcome back</h1>
        <p className="text-muted" style={{ margin: '0 0 20px', fontSize: 13.5 }}>
          Sign in to continue your interview prep.
        </p>
        <Field label="Email" htmlFor="login-email" error={errors.email}>
          <Input
            id="login-email"
            type="email"
            placeholder="priya@example.com"
            value={email}
            invalid={Boolean(errors.email)}
            onChange={(e) => {
              setEmail(e.target.value)
              setErrors((prev) => ({ ...prev, email: undefined }))
            }}
          />
        </Field>
        <Field
          label="Password"
          htmlFor="login-password"
          error={errors.password}
          style={{ marginTop: 12 }}
        >
          <Input
            id="login-password"
            type="password"
            placeholder="••••••••"
            value={password}
            invalid={Boolean(errors.password)}
            onChange={(e) => {
              setPassword(e.target.value)
              setErrors((prev) => ({ ...prev, password: undefined }))
            }}
          />
        </Field>
        <Button type="submit" block style={{ marginTop: 20 }}>
          Sign in
        </Button>
        <p
          className="text-muted"
          style={{ textAlign: 'center', fontSize: 13, margin: '16px 0 0' }}
        >
          No account yet?{' '}
          <button
            type="button"
            className="asc-link"
            style={{ whiteSpace: 'nowrap' }}
            onClick={() => navigate('/register')}
          >
            Create one
          </button>
        </p>
      </form>
    </AuthLayout>
  )
}

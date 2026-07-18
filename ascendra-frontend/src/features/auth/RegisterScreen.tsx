import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { Button, Field, Input } from '../../components/ui'
import { useAuthStore } from '../../stores/authStore'
import { AuthLayout } from './AuthLayout'
import { validateEmail, validateName, validatePassword } from './validation'

interface RegisterErrors {
  name?: string
  email?: string
  password?: string
}

export function RegisterScreen() {
  const navigate = useNavigate()
  const register = useAuthStore((s) => s.register)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<RegisterErrors>({})

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const next: RegisterErrors = {
      name: validateName(name),
      email: validateEmail(email),
      password: validatePassword(password),
    }
    if (next.name || next.email || next.password) {
      setErrors(next)
      return
    }
    register(name.trim(), email.trim())
    navigate('/onboarding')
  }

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} noValidate>
        <h1 style={{ fontSize: 23, margin: '0 0 4px' }}>Create your account</h1>
        <p className="text-muted" style={{ margin: '0 0 20px', fontSize: 13.5 }}>
          Sign up and we'll baseline you with a resume-based diagnostic.
        </p>
        <Field label="Full name" htmlFor="register-name" error={errors.name}>
          <Input
            id="register-name"
            type="text"
            placeholder="Priya Menon"
            value={name}
            invalid={Boolean(errors.name)}
            onChange={(e) => {
              setName(e.target.value)
              setErrors((prev) => ({ ...prev, name: undefined }))
            }}
          />
        </Field>
        <Field
          label="Email"
          htmlFor="register-email"
          error={errors.email}
          style={{ marginTop: 12 }}
        >
          <Input
            id="register-email"
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
          htmlFor="register-password"
          error={errors.password}
          style={{ marginTop: 12 }}
        >
          <Input
            id="register-password"
            type="password"
            placeholder="At least 8 characters"
            value={password}
            invalid={Boolean(errors.password)}
            onChange={(e) => {
              setPassword(e.target.value)
              setErrors((prev) => ({ ...prev, password: undefined }))
            }}
          />
        </Field>
        <Button type="submit" block style={{ marginTop: 20 }}>
          Create account
        </Button>
        <p
          className="text-muted"
          style={{ textAlign: 'center', fontSize: 13, margin: '16px 0 0' }}
        >
          Already have an account?{' '}
          <button
            type="button"
            className="asc-link"
            onClick={() => navigate('/login')}
          >
            Sign in
          </button>
        </p>
      </form>
    </AuthLayout>
  )
}

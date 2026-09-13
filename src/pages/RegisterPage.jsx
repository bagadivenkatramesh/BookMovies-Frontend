import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { registerNormalUser } from '../api/authApi'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/common/Button'
import Alert from '../components/common/Alert'
import { extractErrorMessage } from '../utils/errors'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function RegisterPage() {
  const { isAuthenticated, authLoading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!authLoading && isAuthenticated) {
    return <Navigate to="/" replace />
  }

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function validate() {
    const next = {}
    if (!form.username.trim()) {
      next.username = 'Username is required.'
    }
    if (!form.email.trim()) {
      next.email = 'Email is required.'
    } else if (!EMAIL_PATTERN.test(form.email.trim())) {
      next.email = 'Enter a valid email address.'
    }
    if (!form.password) {
      next.password = 'Password is required.'
    } else if (form.password.length < 6) {
      next.password = 'Use at least 6 characters.'
    }
    if (form.confirmPassword !== form.password) {
      next.confirmPassword = 'Passwords do not match.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitError('')
    if (!validate()) {
      return
    }
    setSubmitting(true)
    try {
      await registerNormalUser({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      })
      navigate('/login', {
        replace: true,
        state: { message: 'Account created. Sign in to start booking.' },
      })
    } catch (err) {
      setSubmitError(err.displayMessage || extractErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container auth-layout">
      <form className="auth-card stack" onSubmit={handleSubmit}>
        <p className="kicker">Join BookMovies</p>
        <h1>Create your account</h1>
        <p className="muted">Registration uses the normal-user endpoint. You will sign in after this step.</p>
        <Alert type="error">{submitError}</Alert>
        <div className="field">
          <label htmlFor="reg-username">Username</label>
          <input
            id="reg-username"
            className="input"
            autoComplete="username"
            value={form.username}
            onChange={(event) => update('username', event.target.value)}
          />
          {errors.username ? <span className="field-error">{errors.username}</span> : null}
        </div>
        <div className="field">
          <label htmlFor="reg-email">Email</label>
          <input
            id="reg-email"
            className="input"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(event) => update('email', event.target.value)}
          />
          {errors.email ? <span className="field-error">{errors.email}</span> : null}
        </div>
        <div className="field">
          <label htmlFor="reg-password">Password</label>
          <input
            id="reg-password"
            className="input"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={(event) => update('password', event.target.value)}
          />
          {errors.password ? <span className="field-error">{errors.password}</span> : null}
        </div>
        <div className="field">
          <label htmlFor="reg-confirm">Confirm password</label>
          <input
            id="reg-confirm"
            className="input"
            type="password"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={(event) => update('confirmPassword', event.target.value)}
          />
          {errors.confirmPassword ? <span className="field-error">{errors.confirmPassword}</span> : null}
        </div>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Register'}
        </Button>
        <p className="muted">
          Already registered? <Link className="link" to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  )
}

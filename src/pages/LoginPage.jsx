import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/common/Button'
import Alert from '../components/common/Alert'
import { extractErrorMessage } from '../utils/errors'

export default function LoginPage() {
  const { login, isAuthenticated, authLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const successMessage = location.state?.message

  if (!authLoading && isAuthenticated) {
    return <Navigate to={location.state?.from || '/'} replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    if (!username.trim() || !password) {
      setError('Username and password are required.')
      return
    }
    setSubmitting(true)
    try {
      await login({ username: username.trim(), password })
      navigate(location.state?.from || '/', { replace: true })
    } catch (err) {
      setError(err.displayMessage || extractErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container auth-layout">
      <form className="auth-card stack" onSubmit={handleSubmit}>
        <p className="kicker">Welcome back</p>
        <h1>Sign in to BookMovies</h1>
        <p className="muted">Use your backend account. Sessions last about one hour.</p>
        {successMessage ? <Alert type="success">{successMessage}</Alert> : null}
        <Alert type="error">{error}</Alert>
        <div className="field">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            className="input"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            className="input"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </Button>
        <p className="muted">
          New here? <Link className="link" to="/register">Create an account</Link>
        </p>
      </form>
    </div>
  )
}

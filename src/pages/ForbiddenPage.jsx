import { Link } from 'react-router-dom'

export default function ForbiddenPage() {
  return (
    <div className="container auth-layout">
      <div className="forbidden-card stack">
        <p className="kicker">403</p>
        <h1>This area is for administrators</h1>
        <p className="muted">
          Your account does not include ROLE_ADMIN. Frontend checks only hide this UI; the backend still
          enforces access.
        </p>
        <Link className="btn" to="/">
          Return home
        </Link>
      </div>
    </div>
  )
}

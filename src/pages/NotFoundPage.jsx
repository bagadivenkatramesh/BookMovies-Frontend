import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="container auth-layout">
      <div className="empty-state stack">
        <p className="kicker">404</p>
        <h1>Page not found</h1>
        <p className="muted">That route is not part of BookMovies.</p>
        <Link className="btn" to="/">
          Go to home
        </Link>
      </div>
    </div>
  )
}

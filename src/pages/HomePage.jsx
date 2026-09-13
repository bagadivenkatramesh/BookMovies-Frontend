import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllMovies } from '../api/movieApi'
import { getAllShows } from '../api/showApi'
import MovieGrid from '../components/movies/MovieGrid'
import PageState from '../components/common/PageState'
import AuthRequired from '../components/common/AuthRequired'
import { extractErrorMessage } from '../utils/errors'
import { useAuth } from '../context/AuthContext'

export default function HomePage() {
  const { isAuthenticated, authLoading } = useAuth()
  const [movies, setMovies] = useState([])
  const [showCount, setShowCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (authLoading || !isAuthenticated) {
      return undefined
    }

    let cancelled = false

    async function load() {
      try {
        const [movieList, shows] = await Promise.all([getAllMovies(), getAllShows().catch(() => [])])
        if (!cancelled) {
          setMovies(movieList)
          setShowCount(shows.length)
          setError('')
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.displayMessage || extractErrorMessage(err))
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [isAuthenticated, authLoading])

  return (
    <div className="container">
      <section className="hero">
        <div>
          <p className="kicker">Cinema booking</p>
          <h1>Reserve the seats. Keep the night.</h1>
          <p className="lede">
            Browse films, compare showtimes, and lock in seats with a layout derived from each theater&apos;s
            capacity. BookMovies is built for a clean, focused ticket flow.
          </p>
          <div className="btn-row mt-lg">
            <Link className="btn" to="/movies">
              Browse movies
            </Link>
            <Link className="btn-secondary" to="/theaters">
              Find theaters
            </Link>
          </div>
        </div>
        <aside className="hero-panel">
          <p className="kicker">Now on BookMovies</p>
          <h2>Plan the screening, then pick seats.</h2>
          <p className="muted">Live catalogue numbers come from the backend when it is reachable.</p>
          <div className="stat-row">
            <div className="stat">
              <strong>{authLoading || (isAuthenticated && loading) ? '—' : movies.length}</strong>
              <span>Movies</span>
            </div>
            <div className="stat">
              <strong>{authLoading || (isAuthenticated && loading) ? '—' : showCount}</strong>
              <span>Showtimes</span>
            </div>
            <div className="stat">
              <strong>₹</strong>
              <span>INR pricing</span>
            </div>
          </div>
        </aside>
      </section>

      <div className="section-head">
        <div>
          <p className="kicker">Catalogue</p>
          <h2>Now playing and upcoming</h2>
        </div>
        <Link className="link" to="/movies">
          View all
        </Link>
      </div>

      <AuthRequired
        title="Sign in to browse the catalogue"
        text="Movie and show endpoints require a JWT. Create an account or sign in to load titles from the backend."
      >
        <PageState
          loading={loading || authLoading}
          error={error}
          onRetry={() => window.location.reload()}
          empty={!movies.length}
          emptyTitle="No movies in the catalogue"
          emptyText="Once movies are added in the admin area, they will appear here."
        >
          <MovieGrid movies={movies.slice(0, 8)} />
        </PageState>
      </AuthRequired>
    </div>
  )
}

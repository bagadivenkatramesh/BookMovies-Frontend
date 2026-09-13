import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { findMovieById } from '../api/movieApi'
import { getShowsByMovie } from '../api/showApi'
import MoviePoster from '../components/movies/MoviePoster'
import ShowList from '../components/shows/ShowList'
import PageState from '../components/common/PageState'
import AuthRequired from '../components/common/AuthRequired'
import { formatDate, formatDuration } from '../utils/formatters'
import { extractErrorMessage } from '../utils/errors'
import { useAuth } from '../context/AuthContext'

export default function MovieDetailsPage() {
  const { movieId } = useParams()
  const location = useLocation()
  const { isAuthenticated, authLoading } = useAuth()
  const [movie, setMovie] = useState(location.state?.movie || null)
  const [shows, setShows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError('')
      try {
        const resolved = await findMovieById(movieId)
        if (!cancelled) {
          setMovie(resolved)
        }
        if (resolved) {
          const showList = await getShowsByMovie(resolved.id)
          if (!cancelled) {
            setShows(showList)
          }
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

    if (authLoading || !isAuthenticated) {
      return undefined
    }

    load()
    return () => {
      cancelled = true
    }
  }, [movieId, isAuthenticated, authLoading])

  if (!loading && !error && !movie && isAuthenticated) {
    return (
      <div className="container">
        <div className="empty-state">
          <h2>Movie not found</h2>
          <p className="muted">
            There is no movie-by-id endpoint, so this page searches the full catalogue. This title was not in
            the current list.
          </p>
          <div className="mt-lg">
            <Link className="btn" to="/movies">
              Back to movies
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <AuthRequired title="Sign in to view this title" text="Movie details and showtimes require an authenticated session.">
      <PageState loading={loading && !movie} error={error} onRetry={() => window.location.reload()}>
        {movie ? (
          <>
            <section className="movie-detail">
              <div className="detail-poster">
                <MoviePoster movie={movie} />
              </div>
              <div>
                <p className="kicker">{movie.genre || 'Feature'}</p>
                <h1 className="page-title">{movie.name}</h1>
                <p className="lede">{movie.description || 'No synopsis is available for this title.'}</p>
                <div className="chip-row">
                  <span className="chip">{movie.language || 'Language TBA'}</span>
                  <span className="chip">{formatDuration(movie.duration)}</span>
                  <span className="chip gold">Released {formatDate(movie.releaseDate)}</span>
                </div>
              </div>
            </section>
            <div className="section-head">
              <div>
                <p className="kicker">Showtimes</p>
                <h2>Choose a screening</h2>
              </div>
            </div>
            <ShowList shows={shows} movieName={movie.name} />
          </>
        ) : null}
      </PageState>
      </AuthRequired>
    </div>
  )
}

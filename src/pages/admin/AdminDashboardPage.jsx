import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllMovies } from '../../api/movieApi'
import { getAllShows } from '../../api/showApi'
import { getBookingsByStatus } from '../../api/bookingApi'
import PageState from '../../components/common/PageState'
import { extractErrorMessage } from '../../utils/errors'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ movies: 0, shows: 0, pending: 0, confirmed: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError('')
      try {
        const [movies, shows, pending, confirmed] = await Promise.all([
          getAllMovies(),
          getAllShows(),
          getBookingsByStatus('PENDING').catch(() => []),
          getBookingsByStatus('CONFIRMED').catch(() => []),
        ])
        if (!cancelled) {
          setStats({
            movies: movies.length,
            shows: shows.length,
            pending: pending.length,
            confirmed: confirmed.length,
          })
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
  }, [])

  return (
    <div>
      <p className="kicker">Admin</p>
      <h1 className="page-title">Dashboard</h1>
      <p className="lede">
        Manage catalogue data used by the booking flow. Theater totals are not listed here because the backend
        has no get-all-theaters endpoint.
      </p>
      <PageState loading={loading} error={error}>
        <div className="stat-row mt-lg">
          <div className="stat">
            <strong>{stats.movies}</strong>
            <span>Movies</span>
          </div>
          <div className="stat">
            <strong>{stats.shows}</strong>
            <span>Shows</span>
          </div>
          <div className="stat">
            <strong>{stats.pending}</strong>
            <span>Pending bookings</span>
          </div>
        </div>
        <div className="btn-row mt-lg">
          <Link className="btn" to="/admin/movies">
            Manage movies
          </Link>
          <Link className="btn-secondary" to="/admin/theaters">
            Manage theaters
          </Link>
          <Link className="btn-secondary" to="/admin/shows">
            Manage shows
          </Link>
          <Link className="btn-secondary" to="/admin/bookings">
            Review bookings
          </Link>
        </div>
        <p className="muted mt-lg">Confirmed bookings currently in the status filter: {stats.confirmed}.</p>
      </PageState>
    </div>
  )
}

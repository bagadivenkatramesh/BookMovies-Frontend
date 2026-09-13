import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { findShowById } from '../api/showApi'
import { createBooking, getBookingsForShow } from '../api/bookingApi'
import SeatMap from '../components/seats/SeatMap'
import PageState from '../components/common/PageState'
import AuthRequired from '../components/common/AuthRequired'
import Alert from '../components/common/Alert'
import { Button } from '../components/common/Button'
import { useAuth } from '../context/AuthContext'
import { occupiedSeatSet } from '../utils/seatLayout'
import { extractErrorMessage } from '../utils/errors'
import { formatDateTime, formatPrice } from '../utils/formatters'

export default function SeatSelectionPage() {
  const { showId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, authLoading } = useAuth()
  const [show, setShow] = useState(location.state?.show || null)
  const [occupied, setOccupied] = useState(new Set())
  const [selectedSeats, setSelectedSeats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const fromState = location.state?.show
        const resolved =
          fromState && Number(fromState.id) === Number(showId) ? fromState : await findShowById(showId)
        if (!resolved) {
          if (!cancelled) {
            setShow(null)
            setError('')
          }
          return
        }
        const bookings = await getBookingsForShow(resolved.id)
        if (!cancelled) {
          setShow(resolved)
          setOccupied(occupiedSeatSet(bookings))
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
  }, [showId, location.state, isAuthenticated, authLoading])

  const movie = show?.movie || {}
  const theater = show?.theater || {}
  const estimatedTotal = useMemo(
    () => (Number(show?.price) || 0) * selectedSeats.length,
    [show?.price, selectedSeats.length],
  )

  function toggleSeat(seat) {
    setSelectedSeats((current) =>
      current.includes(seat) ? current.filter((item) => item !== seat) : [...current, seat],
    )
  }

  async function handleBooking() {
    setSubmitError('')
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/shows/${showId}/seats` } })
      return
    }
    if (!selectedSeats.length) {
      setSubmitError('Select at least one available seat.')
      return
    }
    setSubmitting(true)
    try {
      await createBooking({
        showId: Number(show.id),
        seatNumbers: selectedSeats,
        numberOfSeats: selectedSeats.length,
      })
      navigate('/my-bookings', {
        replace: true,
        state: { message: 'Booking created as PENDING. Confirm it from My Bookings when you are ready.' },
      })
    } catch (err) {
      setSubmitError(err.displayMessage || extractErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  if (!loading && !error && !show && isAuthenticated) {
    return (
      <div className="container">
        <div className="empty-state">
          <h2>Show not found</h2>
          <p className="muted">
            There is no show-by-id endpoint, so this page searches all shows. That screening was not in the
            current list.
          </p>
          <Link className="btn" to="/movies">
            Back to movies
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <AuthRequired title="Sign in to choose seats" text="Occupied seats are loaded from authenticated booking data.">
      <PageState loading={loading} error={error} onRetry={() => window.location.reload()}>
        {show ? (
          <div className="booking-layout">
            <section className="panel padded">
              <p className="kicker">Seat map</p>
              <h1 className="page-title">{movie.name || 'Select seats'}</h1>
              <p className="muted">
                {theater.name || 'Theater'} · {theater.location || 'Location TBA'} · {formatDateTime(show.time)}
              </p>
              <p className="dim">
                Layout is generated from seat capacity ({theater.seatCapacity || 0}). Booked seats come from
                non-cancelled bookings for this show.
              </p>
              <div className="mt-lg">
                <SeatMap
                  seatCapacity={theater.seatCapacity}
                  occupiedSeats={occupied}
                  selectedSeats={selectedSeats}
                  onToggleSeat={toggleSeat}
                />
              </div>
            </section>
            <aside className="panel padded stack">
              <p className="kicker">Summary</p>
              <h2>Review booking</h2>
              <div className="summary-list">
                <div className="summary-row">
                  <span>Movie</span>
                  <strong>{movie.name || '—'}</strong>
                </div>
                <div className="summary-row">
                  <span>Theater</span>
                  <strong>{theater.name || '—'}</strong>
                </div>
                <div className="summary-row">
                  <span>Screen</span>
                  <strong>{theater.screenType || '—'}</strong>
                </div>
                <div className="summary-row">
                  <span>Show time</span>
                  <strong>{formatDateTime(show.time)}</strong>
                </div>
                <div className="summary-row">
                  <span>Seats</span>
                  <strong>{selectedSeats.length ? selectedSeats.join(', ') : 'None selected'}</strong>
                </div>
                <div className="summary-row">
                  <span>Tickets</span>
                  <strong>{selectedSeats.length}</strong>
                </div>
                <div className="summary-row">
                  <span>Price each</span>
                  <strong>{formatPrice(show.price)}</strong>
                </div>
                <div className="summary-row">
                  <span>Estimated total</span>
                  <strong>{formatPrice(estimatedTotal)}</strong>
                </div>
              </div>
              <Alert type="info">
                The backend sets booking status to PENDING and calculates the final price. No payment gateway is
                used.
              </Alert>
              <Alert type="error">{submitError}</Alert>
              <Button onClick={handleBooking} disabled={submitting || !selectedSeats.length}>
                {submitting ? 'Creating booking…' : isAuthenticated ? 'Create booking' : 'Sign in to book'}
              </Button>
              {movie.id ? (
                <Link className="btn-ghost" to={`/movies/${movie.id}`} state={{ movie }}>
                  Back to movie
                </Link>
              ) : null}
            </aside>
          </div>
        ) : null}
      </PageState>
      </AuthRequired>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { cancelBooking, confirmBooking, getMyBookings } from '../api/bookingApi'
import BookingCard from '../components/bookings/BookingCard'
import PageState from '../components/common/PageState'
import Alert from '../components/common/Alert'
import { extractErrorMessage } from '../utils/errors'

export default function MyBookingsPage() {
  const location = useLocation()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [busyId, setBusyId] = useState(null)
  const [info] = useState(location.state?.message || '')

  async function load() {
    setLoading(true)
    setError('')
    try {
      const data = await getMyBookings()
      setBookings(data)
    } catch (err) {
      setError(err.displayMessage || extractErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false

    async function initialLoad() {
      try {
        const data = await getMyBookings()
        if (!cancelled) {
          setBookings(data)
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

    initialLoad()
    return () => {
      cancelled = true
    }
  }, [])

  async function handleCancel(booking) {
    setActionError('')
    setBusyId(booking.id)
    try {
      await cancelBooking(booking.id)
      await load()
    } catch (err) {
      setActionError(err.displayMessage || extractErrorMessage(err))
    } finally {
      setBusyId(null)
    }
  }

  async function handleConfirm(booking) {
    setActionError('')
    setBusyId(booking.id)
    try {
      await confirmBooking(booking.id)
      await load()
    } catch (err) {
      setActionError(err.displayMessage || extractErrorMessage(err))
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="container">
      <p className="kicker">Your tickets</p>
      <h1 className="page-title">My Bookings</h1>
      <p className="lede">
        Bookings are loaded for the signed-in user. Confirmation is a placeholder action — no payment is
        processed. Cancellation may be refused within two hours of showtime.
      </p>
      {info ? <div className="mt-lg"><Alert type="success">{info}</Alert></div> : null}
      {actionError ? <div className="mt-lg"><Alert type="error">{actionError}</Alert></div> : null}
      <div className="mt-lg">
        <PageState
          loading={loading}
          error={error}
          onRetry={load}
          empty={!bookings.length}
          emptyTitle="No bookings yet"
          emptyText="Pick a movie and a show to reserve seats."
        >
          <div className="booking-list">
            {bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancel={handleCancel}
                onConfirm={handleConfirm}
                canceling={busyId === booking.id}
                confirming={busyId === booking.id}
              />
            ))}
          </div>
        </PageState>
      </div>
    </div>
  )
}

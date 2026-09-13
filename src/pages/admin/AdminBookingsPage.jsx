import { useEffect, useState } from 'react'
import {
  cancelBooking,
  confirmBooking,
  getBookingsByStatus,
  getBookingsForShow,
} from '../../api/bookingApi'
import BookingCard from '../../components/bookings/BookingCard'
import PageState from '../../components/common/PageState'
import Alert from '../../components/common/Alert'
import { Button } from '../../components/common/Button'
import { extractErrorMessage } from '../../utils/errors'

const STATUSES = ['PENDING', 'CONFIRMED', 'CANCELLED']

export default function AdminBookingsPage() {
  const [status, setStatus] = useState('PENDING')
  const [showId, setShowId] = useState('')
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [busyId, setBusyId] = useState(null)

  async function loadByStatus(nextStatus = status) {
    setLoading(true)
    setError('')
    setShowId('')
    try {
      setBookings(await getBookingsByStatus(nextStatus))
    } catch (err) {
      setError(err.displayMessage || extractErrorMessage(err))
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  async function loadByShow(event) {
    event.preventDefault()
    if (!showId.trim()) {
      setError('Enter a show ID to load bookings for that screening.')
      return
    }
    setLoading(true)
    setError('')
    try {
      setBookings(await getBookingsForShow(showId.trim()))
    } catch (err) {
      setError(err.displayMessage || extractErrorMessage(err))
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false

    async function initialLoad() {
      try {
        const data = await getBookingsByStatus('PENDING')
        if (!cancelled) {
          setBookings(data)
          setError('')
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.displayMessage || extractErrorMessage(err))
          setBookings([])
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
      await reloadCurrent()
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
      await reloadCurrent()
    } catch (err) {
      setActionError(err.displayMessage || extractErrorMessage(err))
    } finally {
      setBusyId(null)
    }
  }

  async function reloadCurrent() {
    if (showId.trim()) {
      setBookings(await getBookingsForShow(showId.trim()))
    } else {
      setBookings(await getBookingsByStatus(status))
    }
  }

  return (
    <div>
      <p className="kicker">Admin</p>
      <h1 className="page-title">Bookings</h1>
      <p className="lede">
        There is no list-all-bookings endpoint. Filter by status or look up a specific show ID. Confirmation is
        a placeholder and does not process payment.
      </p>
      <Alert type="error">{actionError}</Alert>

      <div className="btn-row mt-lg">
        {STATUSES.map((item) => (
          <Button
            key={item}
            variant={status === item && !showId ? 'primary' : 'secondary'}
            onClick={() => {
              setStatus(item)
              loadByStatus(item)
            }}
          >
            {item}
          </Button>
        ))}
      </div>

      <form className="filters" onSubmit={loadByShow}>
        <div className="field" style={{ gridColumn: '1 / span 3' }}>
          <label htmlFor="booking-show">Show ID</label>
          <input id="booking-show" className="input" value={showId} onChange={(e) => setShowId(e.target.value)} placeholder="Optional lookup" />
        </div>
        <div className="field" style={{ justifyContent: 'end' }}>
          <label>&nbsp;</label>
          <Button type="submit" variant="secondary">Load for show</Button>
        </div>
      </form>

      <PageState
        loading={loading}
        error={error}
        onRetry={() => (showId.trim() ? loadByShow({ preventDefault() {} }) : loadByStatus())}
        empty={!bookings.length}
        emptyTitle="No bookings in this view"
      >
        <div className="booking-list">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              showUser
              onCancel={booking.bookingStatus === 'CANCELLED' ? undefined : handleCancel}
              onConfirm={booking.bookingStatus === 'PENDING' ? handleConfirm : undefined}
              canceling={busyId === booking.id}
              confirming={busyId === booking.id}
            />
          ))}
        </div>
      </PageState>
    </div>
  )
}

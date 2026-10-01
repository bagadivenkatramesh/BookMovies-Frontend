import { Link } from 'react-router-dom'
import { formatDateTime, formatPrice } from '../../utils/formatters'
import { Button } from '../common/Button'

const STATUS_CLASS = {
  PENDING: 'warn',
  CONFIRMED: 'success',
  CANCELLED: 'danger',
}

export default function BookingCard({
  booking,
  onCancel,
  onConfirm,
  canceling,
  confirming,
  showUser = false,
}) {
  const show = booking.show || {}
  const movie = show.movie || {}
  const theater = show.theater || {}
  const seats = Array.isArray(booking.seatNumbers) ? booking.seatNumbers.join(', ') : '—'
  const status = booking.bookingStatus || 'UNKNOWN'

  return (
    <article className="booking-card">
      <div className="chip-row">
        <span className={`chip ${STATUS_CLASS[status] || 'info'}`}>{status}</span>
        <span className="chip">{formatPrice(booking.price)}</span>
      </div>
      <h3>{booking.movieName || 'Movie'}</h3>
      <p className="meta">
        {booking.theaterName || 'Theater'} · {booking.theaterLocation || 'Location TBA'}
        {booking.theaterScreenType ? ` · ${booking.theaterScreenType}` : ''}
      </p>
      <div className="summary-list mt-lg">
        <div className="summary-row">
          <span>Show</span>
          <strong>{formatDateTime(booking.showTime)}</strong>
        </div>
        <div className="summary-row">
          <span>Seats</span>
          <strong>{seats}</strong>
        </div>
        <div className="summary-row">
          <span>Tickets</span>
          <strong>{booking.numberOfSeats}</strong>
        </div>
        <div className="summary-row">
          <span>Booked on</span>
          <strong>{formatDateTime(booking.bookingTime)}</strong>
        </div>
        {showUser && booking.user?.username ? (
          <div className="summary-row">
            <span>Guest</span>
            <strong>{booking.user.username}</strong>
          </div>
        ) : null}
      </div>
      <div className="btn-row mt-lg">
        {booking.movieId ? (
          <Link className="btn-secondary" to={`/movies/${booking.movieId}`} state={{ movie }}>
            Movie details
          </Link>
        ) : null}
        {status !== 'CANCELLED' ? (
          <Button variant="danger" onClick={() => onCancel?.(booking)} disabled={canceling}>
            {canceling ? 'Cancelling…' : 'Cancel booking'}
          </Button>
        ) : null}
        {status === 'PENDING' && onConfirm ? (
          <Button onClick={() => onConfirm(booking)} disabled={confirming}>
            {confirming ? 'Confirming…' : 'Confirm booking (no payment)'}
          </Button>
        ) : null}
      </div>
    </article>
  )
}

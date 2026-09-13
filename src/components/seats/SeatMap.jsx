import { generateSeatLabels, groupSeatsByRow } from '../../utils/seatLayout'

export default function SeatMap({
  seatCapacity,
  occupiedSeats,
  selectedSeats,
  onToggleSeat,
}) {
  const labels = generateSeatLabels(seatCapacity)
  const rows = groupSeatsByRow(labels)

  if (!labels.length) {
    return <p className="muted">This theater has no seat capacity configured.</p>
  }

  return (
    <div className="seat-layout">
      <div className="screen">Screen</div>
      {rows.map((row) => (
        <div className="seat-row" key={row.row}>
          <span className="row-label">{row.row}</span>
          <div className="seat-row-seats">
            {row.seats.map((seat) => {
              const unavailable = occupiedSeats.has(seat)
              const selected = selectedSeats.includes(seat)
              const className = `seat${unavailable ? ' unavailable' : ''}${selected ? ' selected' : ''}`
              return (
                <button
                  key={seat}
                  type="button"
                  className={className}
                  disabled={unavailable}
                  onClick={() => onToggleSeat(seat)}
                  aria-pressed={selected}
                  aria-label={`Seat ${seat}${unavailable ? ' unavailable' : selected ? ' selected' : ' available'}`}
                >
                  {seat.replace(row.row, '')}
                </button>
              )
            })}
          </div>
        </div>
      ))}
      <div className="legend">
        <span className="legend-item">
          <span className="seat" /> Available
        </span>
        <span className="legend-item">
          <span className="seat selected" /> Selected
        </span>
        <span className="legend-item">
          <span className="seat unavailable" /> Booked
        </span>
      </div>
    </div>
  )
}

const DEFAULT_SEATS_PER_ROW = 10
const ROW_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

/**
 * Deterministic seat labels from theater.seatCapacity.
 * Isolated so a future backend Seat/layout model can replace this module.
 */
export function generateSeatLabels(seatCapacity, seatsPerRow = DEFAULT_SEATS_PER_ROW) {
  const capacity = Math.max(0, Math.floor(Number(seatCapacity) || 0))
  const perRow = Math.max(1, seatsPerRow)
  const labels = []

  for (let index = 0; index < capacity; index += 1) {
    const rowIndex = Math.floor(index / perRow)
    const seatNumber = (index % perRow) + 1
    labels.push(`${rowLetter(rowIndex)}${seatNumber}`)
  }

  return labels
}

export function groupSeatsByRow(seatLabels) {
  const rows = []
  const indexByRow = new Map()

  for (const label of seatLabels) {
    const rowKey = label.replace(/\d+$/, '') || 'A'
    if (!indexByRow.has(rowKey)) {
      indexByRow.set(rowKey, rows.length)
      rows.push({ row: rowKey, seats: [] })
    }
    rows[indexByRow.get(rowKey)].seats.push(label)
  }

  return rows
}

export function occupiedSeatSet(bookings) {
  const occupied = new Set()
  if (!Array.isArray(bookings)) {
    return occupied
  }

  for (const booking of bookings) {
    if (!booking || booking.bookingStatus === 'CANCELLED') {
      continue
    }
    const seats = Array.isArray(booking.seatNumbers) ? booking.seatNumbers : []
    for (const seat of seats) {
      if (seat) {
        occupied.add(String(seat))
      }
    }
  }

  return occupied
}

function rowLetter(rowIndex) {
  if (rowIndex < ROW_LETTERS.length) {
    return ROW_LETTERS[rowIndex]
  }
  return `R${rowIndex + 1}`
}

const rupeeFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

const rupeeFormatterWithPaise = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatPrice(value) {
  const amount = Number(value)
  if (!Number.isFinite(amount)) {
    return '₹0'
  }
  return Number.isInteger(amount) ? rupeeFormatter.format(amount) : rupeeFormatterWithPaise.format(amount)
}

export function formatDuration(minutes) {
  const total = Number(minutes)
  if (!Number.isFinite(total) || total < 0) {
    return 'Duration unavailable'
  }
  const hours = Math.floor(total / 60)
  const mins = Math.round(total % 60)
  if (hours === 0) {
    return `${mins}m`
  }
  if (mins === 0) {
    return `${hours}h`
  }
  return `${hours}h ${mins}m`
}

export function formatDate(value) {
  if (!value) {
    return 'Date unavailable'
  }
  const date = parseBackendDate(value)
  if (!date) {
    return String(value)
  }
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function formatDateTime(value) {
  if (!value) {
    return 'Time unavailable'
  }
  const date = parseBackendDateTime(value)
  if (!date) {
    return String(value)
  }
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date)
}

export function formatTime(value) {
  if (!value) {
    return ''
  }
  const date = parseBackendDateTime(value)
  if (!date) {
    return String(value)
  }
  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date)
}

export function toDateTimeLocalValue(value) {
  if (!value) {
    return ''
  }
  const normalized = String(value).replace(' ', 'T')
  return normalized.slice(0, 16)
}

export function fromDateTimeLocalValue(value) {
  if (!value) {
    return ''
  }
  return value.length === 16 ? `${value}:00` : value
}

/**
 * Backend LocalDate / LocalDateTime values do not include a timezone.
 * Parse them as local calendar values rather than UTC.
 */
function parseBackendDate(value) {
  const text = String(value)
  const match = text.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!match) {
    return null
  }
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
}

function parseBackendDateTime(value) {
  const text = String(value).replace(' ', 'T')
  const match = text.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?/)
  if (!match) {
    return parseBackendDate(value)
  }
  return new Date(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
    Number(match[4]),
    Number(match[5]),
    Number(match[6] || 0),
  )
}

export function getShowDateTime(value) {
  return parseBackendDateTime(value)
}

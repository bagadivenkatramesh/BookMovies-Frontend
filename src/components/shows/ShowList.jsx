import { Link } from 'react-router-dom'
import { formatDateTime, formatPrice } from '../../utils/formatters'
import EmptyState from '../common/EmptyState'

export default function ShowList({ shows, movieName }) {
  if (!shows?.length) {
    return (
      <EmptyState
        title="No shows scheduled"
        text={`There are currently no showtimes listed${movieName ? ` for ${movieName}` : ''}.`}
      />
    )
  }

  return (
    <div className="show-list">
      {shows.map((show) => (
        <article key={show.id} className="show-card">
          <div className="chip-row">
            <span className="chip gold">
              {formatDateTime(show.time)}
            </span>
            <span className="chip">
              {formatPrice(show.price)}
            </span>
          </div>

          <Link
            className="btn"
            to={`/shows/${show.id}/seats`}
            state={{ show }}
          >
            Select seats
          </Link>
        </article>
      ))}
    </div>
  )
}
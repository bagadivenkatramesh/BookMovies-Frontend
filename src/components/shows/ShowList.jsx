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
      {shows.map((show) => {
        const theater = show.theater || {}
        return (
          <article key={show.id} className="show-card">
            <div>
              <h3>{theater.name || 'Theater TBA'}</h3>
              <p className="meta">
                {theater.location || 'Location TBA'}
                {theater.screenType ? ` · ${theater.screenType}` : ''}
              </p>
              <div className="chip-row">
                <span className="chip gold">{formatDateTime(show.time)}</span>
                <span className="chip">{formatPrice(show.price)}</span>
              </div>
            </div>
            <Link className="btn" to={`/shows/${show.id}/seats`} state={{ show }}>
              Select seats
            </Link>
          </article>
        )
      })}
    </div>
  )
}

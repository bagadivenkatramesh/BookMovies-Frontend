import { Link } from 'react-router-dom'
import { formatDateTime, formatPrice } from '../../utils/formatters'
import EmptyState from '../common/EmptyState'

export default function ShowList({ shows, movieName, viewBy }) {
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
          <div>
            <h3>{viewBy === 'theater'
              ? show.movieName || 'Movie Name TBA'
              : show.theaterName || 'Theater Name TBA'}</h3>
            <div className="show-details">
              <p className="location-language">
                {viewBy === 'theater'
                  ? show.movieLanguage || 'Movie Language TBA'
                  : show.theaterLocation || 'Theater Location TBA'}
              </p>

              <p className="screen-genre">
                {viewBy === 'theater'
                  ? show.movieGenre || 'Movie Genre TBA'
                  : show.theaterScreenType || 'Screen Type TBA'}
              </p>
            </div>
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
      )}
    </div>
  )
}

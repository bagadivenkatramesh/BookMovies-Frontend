import { Link } from 'react-router-dom'
import { formatDuration } from '../../utils/formatters'
import MoviePoster from './MoviePoster'

export default function MovieCard({ movie }) {
  return (
    <Link to={`/movies/${movie.id}`} state={{ movie }} className="movie-card">
      <MoviePoster movie={movie} />
      <div className="movie-body">
        <h3>{movie.name}</h3>
        <p className="meta">
          {movie.language || 'Language TBA'} · {formatDuration(movie.duration)}
        </p>
        <div className="chip-row">
          {movie.releaseDate ? <span className="chip">{movie.releaseDate}</span> : null}
        </div>
      </div>
    </Link>
  )
}

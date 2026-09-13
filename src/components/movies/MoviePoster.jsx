import { getMovieInitials, getMoviePosterStyle } from '../../utils/moviePoster'

export default function MoviePoster({ movie, className = '' }) {
  return (
    <div className={`poster ${className}`.trim()} style={getMoviePosterStyle(movie)}>
      <div className="poster-top">
        <span className="chip gold">{movie?.genre || 'Film'}</span>
      </div>
      <div className="poster-bottom">
        <div className="poster-initials">{getMovieInitials(movie)}</div>
      </div>
    </div>
  )
}

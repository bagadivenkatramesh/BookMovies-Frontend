
export default function MoviePoster({ movie, className = '' }) {
  return (
    <div className={`poster ${className}`.trim()}>
      <img
        src={movie?.posterUrl}
        alt={`${movie?.name || 'Movie'} poster`}
        className="poster-image"
      />
    </div>
  )
}

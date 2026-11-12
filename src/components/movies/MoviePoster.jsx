export default function MoviePoster({ movie, className = '' }) {
  return (
    <div className={`poster ${className}`.trim()}>
      {movie?.posterUrl && (
        <>
          <img
            src={movie.posterUrl}
            alt=""
            className="poster-background"
          />

          <img
            src={movie.posterUrl}
            alt={`${movie?.name || 'Movie'} poster`}
            className="poster-image"
          />
        </>
      )}
    </div>
  )
}
import MovieCard from './MovieCard'
import EmptyState from '../common/EmptyState'

export default function MovieGrid({ movies }) {
  if (!movies?.length) {
    return (
      <EmptyState
        title="No movies found"
        text="Try another title, genre, or language. The catalogue is loaded from the BookMovies backend."
      />
    )
  }

  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  )
}

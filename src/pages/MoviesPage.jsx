import { useEffect, useState } from 'react'
import {
  getAllMovies,
  getMoviesByGenre,
  getMoviesByLanguage,
  getMoviesByTitle,
} from '../api/movieApi'
import MovieFilters from '../components/movies/MovieFilters'
import MovieGrid from '../components/movies/MovieGrid'
import PageState from '../components/common/PageState'
import AuthRequired from '../components/common/AuthRequired'
import { extractErrorMessage } from '../utils/errors'

import { useAuth } from '../context/AuthContext'

export default function MoviesPage() {
  const { isAuthenticated, authLoading } = useAuth()
  const [title, setTitle] = useState('')
  const [genre, setGenre] = useState('')
  const [language, setLanguage] = useState('')
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadMovies(filters = { title: '', genre: '', language: '' }) {
    setLoading(true)
    setError('')
    try {
      const data = await fetchMovies(filters)
      setMovies(data)
    } catch (err) {
      setError(err.displayMessage || extractErrorMessage(err))
      setMovies([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authLoading || !isAuthenticated) {
      return undefined
    }

    let cancelled = false

    async function initialLoad() {
      try {
        const data = await fetchMovies({ title: '', genre: '', language: '' })
        if (!cancelled) {
          setMovies(data)
          setError('')
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.displayMessage || extractErrorMessage(err))
          setMovies([])
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    initialLoad()
    return () => {
      cancelled = true
    }
  }, [authLoading, isAuthenticated])

  function handleSubmit(event) {
    event.preventDefault()
    loadMovies({ title: title.trim(), genre: genre.trim(), language: language.trim() })
  }

  function handleReset() {
    setTitle('')
    setGenre('')
    setLanguage('')
    loadMovies({ title: '', genre: '', language: '' })
  }

  return (
    <div className="container">
      <p className="kicker">Discover</p>
      <h1 className="page-title">Movies</h1>
      <p className="lede">Search by title or filter using the dedicated genre and language APIs.</p>
      <AuthRequired
        title="Sign in to search movies"
        text="Title, genre, and language filters call authenticated movie endpoints."
      >
        <div className="mt-lg">
          <MovieFilters
            title={title}
            genre={genre}
            language={language}
            onTitleChange={setTitle}
            onGenreChange={setGenre}
            onLanguageChange={setLanguage}
            onSubmit={handleSubmit}
            onReset={handleReset}
          />
        </div>
        <PageState loading={loading} error={error} onRetry={handleSubmit}>
          <MovieGrid movies={movies} />
        </PageState>
      </AuthRequired>
    </div>
  )
}

async function fetchMovies({ title, genre, language }) {
  let movies
  if (title) {
    movies = await getMoviesByTitle(title)
  } else if (genre) {
    movies = await getMoviesByGenre(genre)
  } else if (language) {
    movies = await getMoviesByLanguage(language)
  } else {
    movies = await getAllMovies()
  }

  return movies.filter((movie) => {
    const matchesGenre = !genre || String(movie.genre || '').toLowerCase().includes(genre.toLowerCase())
    const matchesLanguage =
      !language || String(movie.language || '').toLowerCase().includes(language.toLowerCase())
    const matchesTitle = !title || String(movie.name || '').toLowerCase().includes(title.toLowerCase())
    return matchesGenre && matchesLanguage && matchesTitle
  })
}

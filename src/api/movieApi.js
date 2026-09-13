import { apiClient } from './apiClient'
import { asArray } from '../utils/collections'

export async function getAllMovies() {
  const { data } = await apiClient.get('/api/movie/get_all_movies')
  return asArray(data)
}

export async function getMoviesByGenre(genre) {
  const { data } = await apiClient.get('/api/movie/get_movies_by_genre', { params: { genre } })
  return asArray(data)
}

export async function getMoviesByLanguage(language) {
  const { data } = await apiClient.get('/api/movie/get_movies_by_language', { params: { language } })
  return asArray(data)
}

export async function getMoviesByTitle(title) {
  const { data } = await apiClient.get('/api/movie/get_movie_by_title', { params: { title } })
  return asArray(data)
}

export async function addMovie(payload) {
  const { data } = await apiClient.post('/api/movie/add_movie', payload)
  return data
}

export async function updateMovie(id, payload) {
  const { data } = await apiClient.put(`/api/movie/update_movie/${id}`, payload)
  return data
}

export async function deleteMovie(id) {
  const { data } = await apiClient.delete(`/api/movie/delete_movie/${id}`)
  return data
}

/**
 * The backend does not expose GET /api/movie/{id}.
 * Movie details are resolved from the full movie list.
 */
export async function findMovieById(movieId) {
  const movies = await getAllMovies()
  return movies.find((movie) => Number(movie.id) === Number(movieId)) || null
}

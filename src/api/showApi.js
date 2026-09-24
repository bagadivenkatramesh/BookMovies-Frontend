import { apiClient } from './apiClient'
import { asArray } from '../utils/collections'

export async function getAllShows() {
  const { data } = await apiClient.get('/api/show/get_all_shows')
  return asArray(data)
}

export async function getShowsByMovie(movieId) {
  const { data } = await apiClient.get(`/api/show/get_shows_by_movie/${movieId}`)
  return asArray(data)
}

export async function getShowsByTheater(theaterId) {
  const { data } = await apiClient.get(`/api/show/get_shows_by_theater/${theaterId}`)
  return asArray(data)
}

export async function createShow(payload) {
  const { data } = await apiClient.post('/api/show/create_show', payload)
  return data
}

export async function updateShow(id, payload) {
  const { data } = await apiClient.put(`/api/show/update_show/${id}`, payload)
  return data
}

export async function deleteShow(id) {
  const { data } = await apiClient.delete(`/api/show/delete_show/${id}`)
  return data
}

export async function findShowById(showId) {
  const shows = await getAllShows()
  return shows.find((show) => Number(show.id) === Number(showId)) || null
}

//purpose of this line - to maintain daily github commit activity, LOL
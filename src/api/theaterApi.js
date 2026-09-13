import { apiClient } from './apiClient'
import { asArray } from '../utils/collections'

export async function getTheatersByLocation(location) {
  const { data } = await apiClient.get('/api/theater/get_theaters_by_location', {
    params: { location },
  })
  return asArray(data)
}

export async function addTheater(payload) {
  const { data } = await apiClient.post('/api/theater/add_theater', payload)
  return data
}

export async function updateTheater(id, payload) {
  const { data } = await apiClient.put(`/api/theater/update_theater/${id}`, payload)
  return data
}

export async function deleteTheater(id) {
  const { data } = await apiClient.delete(`/api/theater/delete_theater/${id}`)
  return data
}

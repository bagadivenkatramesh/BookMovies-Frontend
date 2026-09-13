import { apiClient } from './apiClient'
import { sanitizeUser } from '../utils/collections'

export async function login({ username, password }) {
  const { data } = await apiClient.post('/api/auth/login', { username, password })
  return data
}

export async function registerNormalUser({ username, email, password }) {
  const { data } = await apiClient.post('/api/auth/register_normal_user', {
    username,
    email,
    password,
  })
  return data
}

export async function getCurrentUser() {
  const { data } = await apiClient.get('/api/auth/me')
  return sanitizeUser(data)
}

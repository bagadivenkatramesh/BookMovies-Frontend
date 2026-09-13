import axios from 'axios'
import { extractErrorMessage } from '../utils/errors'
import { clearStoredToken, readStoredToken } from '../utils/tokenStorage'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

let unauthorizedHandler = null

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = readStoredToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    const url = String(error?.config?.url || '')
    const isCredentialRequest = url.includes('/api/auth/login') || url.includes('/api/auth/register')

    if (status === 401 && !isCredentialRequest && readStoredToken()) {
      clearStoredToken()
      unauthorizedHandler?.()
    }

    error.displayMessage = extractErrorMessage(error)
    return Promise.reject(error)
  },
)

export function getApiBaseUrl() {
  return API_BASE_URL
}

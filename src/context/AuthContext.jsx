import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getCurrentUser, login as loginRequest } from '../api/authApi'
import { setUnauthorizedHandler } from '../api/apiClient'
import { clearStoredToken, persistToken, readStoredToken } from '../utils/tokenStorage'
import { isUnauthorizedError } from '../utils/errors'

const AuthContext = createContext(null)

/* eslint-disable react-refresh/only-export-components -- useAuth belongs with the provider. */

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => readStoredToken())
  const [currentUser, setCurrentUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  const clearAuthentication = useCallback(() => {
    clearStoredToken()
    setToken(null)
    setCurrentUser(null)
  }, [])

  const refreshCurrentUser = useCallback(async () => {
    const stored = readStoredToken()
    if (!stored) {
      setCurrentUser(null)
      setToken(null)
      return null
    }

    const user = await getCurrentUser()
    setToken(stored)
    setCurrentUser(user)
    return user
  }, [])

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setToken(null)
      setCurrentUser(null)
    })
    return () => setUnauthorizedHandler(null)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function restoreSession() {
      const stored = readStoredToken()
      if (!stored) {
        if (!cancelled) {
          setAuthLoading(false)
        }
        return
      }

      try {
        const user = await getCurrentUser()
        if (!cancelled) {
          setToken(stored)
          setCurrentUser(user)
        }
      } catch (error) {
        if (!cancelled) {
          if (isUnauthorizedError(error)) {
            clearAuthentication()
          } else {
            setToken(stored)
            setCurrentUser(null)
          }
        }
      } finally {
        if (!cancelled) {
          setAuthLoading(false)
        }
      }
    }

    restoreSession()
    return () => {
      cancelled = true
    }
  }, [clearAuthentication])

  const login = useCallback(async ({ username, password }) => {
    const response = await loginRequest({ username, password })
    const jwtToken = response?.jwtToken
    if (!jwtToken) {
      throw new Error('Login succeeded but no token was returned by the server.')
    }
    persistToken(jwtToken)
    setToken(jwtToken)
    const user = await getCurrentUser()
    setCurrentUser(user)
    return user
  }, [])

  const logout = useCallback(() => {
    clearAuthentication()
  }, [clearAuthentication])

  const value = useMemo(() => {
    const roles = currentUser?.roles || []
    return {
      token,
      currentUser,
      isAuthenticated: Boolean(token && currentUser),
      isAdmin: roles.includes('ROLE_ADMIN'),
      authLoading,
      login,
      logout,
      refreshCurrentUser,
      clearAuthentication,
    }
  }, [token, currentUser, authLoading, login, logout, refreshCurrentUser, clearAuthentication])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

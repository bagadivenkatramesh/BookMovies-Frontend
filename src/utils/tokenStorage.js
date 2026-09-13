const TOKEN_KEY = 'bookmovies_access_token'

export function readStoredToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function persistToken(token) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token)
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }
  } catch {
    // Storage may be unavailable in private browsing modes.
  }
}

export function clearStoredToken() {
  persistToken(null)
}

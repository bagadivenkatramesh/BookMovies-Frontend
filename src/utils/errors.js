export function extractErrorMessage(error) {
  if (!error) {
    return 'Something went wrong. Please try again.'
  }

  if (error.response) {
    const { data, status, statusText } = error.response
    const fromBody = extractFromBody(data)
    if (fromBody) {
      return fromBody
    }

    const statusMessages = {
      400: 'The request could not be processed. Please review your details.',
      401: 'Your session is invalid or has expired. Please sign in again.',
      403: 'You do not have permission to perform this action.',
      404: 'The requested resource was not found.',
      409: 'This action conflicts with existing data.',
      500: 'The server encountered an error. Please try again later.',
      502: 'The booking service is temporarily unavailable.',
      503: 'The booking service is temporarily unavailable.',
    }

    return statusMessages[status] || statusText || 'Something went wrong. Please try again.'
  }

  if (error.request) {
    return 'Unable to reach the BookMovies server. Confirm the backend is running on port 8080.'
  }

  return error.message || 'Something went wrong. Please try again.'
}

function extractFromBody(data) {
  if (data == null || data === '') {
    return null
  }

  if (typeof data === 'string') {
    const trimmed = data.trim()
    return trimmed || null
  }

  if (typeof data === 'object') {
    const candidates = [data.message, data.error, data.detail, data.title, data.path]
    for (const candidate of candidates) {
      if (typeof candidate === 'string' && candidate.trim()) {
        return candidate.trim()
      }
    }

    if (Array.isArray(data.errors) && data.errors.length > 0) {
      const first = data.errors[0]
      if (typeof first === 'string') {
        return first
      }
      if (first && typeof first === 'object' && first.message) {
        return String(first.message)
      }
    }
  }

  return null
}

export function isUnauthorizedError(error) {
  return error?.response?.status === 401
}

export function isForbiddenError(error) {
  return error?.response?.status === 403
}

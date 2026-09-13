export function asArray(data) {
  if (data == null) {
    return []
  }
  return Array.isArray(data) ? data : [data]
}

export function uniqueById(items) {
  const seen = new Set()
  const result = []
  for (const item of items) {
    if (!item || item.id == null || seen.has(item.id)) {
      continue
    }
    seen.add(item.id)
    result.push(item)
  }
  return result
}

export function sanitizeUser(user) {
  if (!user || typeof user !== 'object') {
    return null
  }
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    roles: Array.isArray(user.roles) ? user.roles : [],
  }
}

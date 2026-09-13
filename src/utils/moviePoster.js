const PALETTES = [
  ['#2b1a3a', '#c45c26'],
  ['#12263a', '#e0a458'],
  ['#1c2e1c', '#7d9a5f'],
  ['#3a1420', '#d46a6a'],
  ['#1a2744', '#6ea8d8'],
  ['#2a2210', '#d4b483'],
  ['#241833', '#9b6b9e'],
  ['#102f2b', '#4fb0a5'],
]

export function getMoviePosterStyle(movie) {
  const seed = String(movie?.name || movie?.id || 'movie')
  const palette = PALETTES[hashString(seed) % PALETTES.length]
  return {
    backgroundImage: `linear-gradient(160deg, ${palette[0]} 0%, ${palette[1]} 100%)`,
  }
}

export function getMovieInitials(movie) {
  const name = String(movie?.name || 'BM').trim()
  const parts = name.split(/\s+/).filter(Boolean)
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }
  return `${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase()
}

function hashString(value) {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0
  }
  return hash
}

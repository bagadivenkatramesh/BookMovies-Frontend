import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getTheatersByLocation } from '../api/theaterApi'
import { getShowsByTheater } from '../api/showApi'
import PageState from '../components/common/PageState'
import AuthRequired from '../components/common/AuthRequired'
import ShowList from '../components/shows/ShowList'
import { extractErrorMessage } from '../utils/errors'

export default function TheatersPage() {
  const [location, setLocation] = useState('')
  const [theaters, setTheaters] = useState([])
  const [selectedTheater, setSelectedTheater] = useState(null)
  const [shows, setShows] = useState([])
  const [loading, setLoading] = useState(false)
  const [showsLoading, setShowsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showError, setShowError] = useState('')
  const [searched, setSearched] = useState(false)

  async function search(event) {
    event?.preventDefault()
    const query = location.trim()
    if (!query) {
      setError('Enter a location to search theaters.')
      return
    }
    setLoading(true)
    setError('')
    setSearched(true)
    setSelectedTheater(null)
    setShows([])
    try {
      const results = await getTheatersByLocation(query)
      setTheaters(results)
    } catch (err) {
      setError(err.displayMessage || extractErrorMessage(err))
      setTheaters([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!selectedTheater) {
      return undefined
    }
    let cancelled = false
    async function loadShows() {
      setShowsLoading(true)
      setShowError('')
      try {
        const data = await getShowsByTheater(selectedTheater.id)
        if (!cancelled) {
          setShows(data)
        }
      } catch (err) {
        if (!cancelled) {
          setShowError(err.displayMessage || extractErrorMessage(err))
        }
      } finally {
        if (!cancelled) {
          setShowsLoading(false)
        }
      }
    }
    loadShows()
    return () => {
      cancelled = true
    }
  }, [selectedTheater])

  return (
    <div className="container">
      <p className="kicker">Venues</p>
      <h1 className="page-title">Find theaters</h1>
      <p className="lede">
        Theater discovery uses location search. There is no public list-all-theaters endpoint, so enter a city
        or area to load venues.
      </p>

      <AuthRequired title="Sign in to find theaters" text="Theater lookup by location is an authenticated endpoint.">
      <form className="filters mt-lg" onSubmit={search}>
        <div className="field full" style={{ gridColumn: '1 / span 3' }}>
          <label htmlFor="location">Location</label>
          <input
            id="location"
            className="input"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="e.g. Mumbai"
          />
        </div>
        <div className="field" style={{ justifyContent: 'end' }}>
          <label>&nbsp;</label>
          <button className="btn" type="submit">
            Search
          </button>
        </div>
      </form>

      <PageState
        loading={loading}
        error={error}
        onRetry={search}
        empty={searched && !theaters.length}
        emptyTitle="No theaters for that location"
        emptyText="Try a different location string that matches how venues were saved in the backend."
      >
        <div className="card-grid">
          {theaters.map((theater) => (
            <article key={theater.id} className="theater-card">
              <h3>{theater.name}</h3>
              <p className="meta">{theater.location}</p>
              <div className="chip-row">
                <span className="chip">{theater.screenType || 'Screen TBA'}</span>
                <span className="chip gold">{theater.seatCapacity || 0} seats</span>
              </div>
              <button className="btn" type="button" onClick={() => setSelectedTheater(theater)}>
                View shows
              </button>
            </article>
          ))}
        </div>
      </PageState>

      {selectedTheater ? (
        <section className="mt-lg">
          <div className="section-head">
            <div>
              <p className="kicker">Showtimes</p>
              <h2>{selectedTheater.name}</h2>
            </div>
            <Link className="link" to="/movies">
              Prefer browsing by movie?
            </Link>
          </div>
          <PageState loading={showsLoading} error={showError}>
            <ShowList shows={shows} />
          </PageState>
        </section>
      ) : null}
      </AuthRequired>
    </div>
  )
}

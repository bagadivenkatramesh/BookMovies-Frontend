import { useEffect, useMemo, useState } from 'react'
import { getAllMovies } from '../../api/movieApi'
import { getTheatersByLocation } from '../../api/theaterApi'
import { createShow, deleteShow, getAllShows, updateShow } from '../../api/showApi'
import { Button } from '../../components/common/Button'
import Alert from '../../components/common/Alert'
import PageState from '../../components/common/PageState'
import { extractErrorMessage } from '../../utils/errors'
import { formatDateTime, formatPrice, fromDateTimeLocalValue, toDateTimeLocalValue } from '../../utils/formatters'
import { uniqueById } from '../../utils/collections'

const EMPTY_FORM = {
  time: '',
  price: '',
  movieId: '',
  theaterId: '',
}

export default function AdminShowsPage() {
  const [shows, setShows] = useState([])
  const [movies, setMovies] = useState([])
  const [theaters, setTheaters] = useState([])
  const [locationQuery, setLocationQuery] = useState('')
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    setError('')
    try {
      const [showList, movieList] = await Promise.all([getAllShows(), getAllMovies()])
      setShows(showList)
      setMovies(movieList)
      const fromShows = uniqueById(showList.map((show) => show.theater).filter(Boolean))
      setTheaters((current) => uniqueById([...fromShows, ...current]))
    } catch (err) {
      setError(err.displayMessage || extractErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false

    async function initialLoad() {
      try {
        const [showList, movieList] = await Promise.all([getAllShows(), getAllMovies()])
        if (!cancelled) {
          setShows(showList)
          setMovies(movieList)
          const fromShows = uniqueById(showList.map((show) => show.theater).filter(Boolean))
          setTheaters((current) => uniqueById([...fromShows, ...current]))
          setError('')
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.displayMessage || extractErrorMessage(err))
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    initialLoad()
    return () => {
      cancelled = true
    }
  }, [])

  const theaterOptions = useMemo(() => uniqueById(theaters), [theaters])

  async function loadTheatersByLocation(event) {
    event.preventDefault()
    if (!locationQuery.trim()) return
    try {
      const found = await getTheatersByLocation(locationQuery.trim())
      setTheaters((current) => uniqueById([...current, ...found]))
      if (!found.length) {
        setFormError('No theaters matched that location.')
      } else {
        setFormError('')
      }
    } catch (err) {
      setFormError(err.displayMessage || extractErrorMessage(err))
    }
  }

  function validate() {
    const next = {}
    if (!form.movieId) next.movieId = 'Select a movie.'
    if (!form.theaterId) next.theaterId = 'Select a theater.'
    if (!form.time) next.time = 'Show date and time are required.'
    const price = Number(form.price)
    if (!Number.isFinite(price) || price < 0) next.price = 'Enter a valid price.'
    setFieldErrors(next)
    return Object.keys(next).length === 0
  }

  function payload() {
    return {
      time: fromDateTimeLocalValue(form.time),
      price: Number(form.price),
      movieId: Number(form.movieId),
      theaterId: Number(form.theaterId),
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError('')
    setSuccess('')
    if (!validate()) return
    setSaving(true)
    try {
      if (editingId) {
        await updateShow(editingId, payload())
        setSuccess('Show updated.')
      } else {
        await createShow(payload())
        setSuccess('Show created.')
      }
      setForm(EMPTY_FORM)
      setEditingId(null)
      await load()
    } catch (err) {
      setFormError(err.displayMessage || extractErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  function startEdit(show) {
    setEditingId(show.id)
    setForm({
      time: toDateTimeLocalValue(show.time),
      price: show.price ?? '',
      movieId: show.movie?.id ? String(show.movie.id) : '',
      theaterId: show.theater?.id ? String(show.theater.id) : '',
    })
    if (show.theater) {
      setTheaters((current) => uniqueById([...current, show.theater]))
    }
  }

  async function handleDelete(show) {
    if (!window.confirm('Delete this show? The backend will refuse if it already has bookings.')) return
    setFormError('')
    try {
      await deleteShow(show.id)
      await load()
    } catch (err) {
      setFormError(err.displayMessage || extractErrorMessage(err))
    }
  }

  return (
    <div>
      <p className="kicker">Admin</p>
      <h1 className="page-title">Shows</h1>
      <Alert type="error">{formError}</Alert>
      <Alert type="success">{success}</Alert>

      <form className="panel padded form-grid mt-lg" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="show-movie">Movie</label>
          <select id="show-movie" className="select" value={form.movieId} onChange={(e) => setForm({ ...form, movieId: e.target.value })}>
            <option value="">Select movie</option>
            {movies.map((movie) => (
              <option key={movie.id} value={movie.id}>
                {movie.name}
              </option>
            ))}
          </select>
          {fieldErrors.movieId ? <span className="field-error">{fieldErrors.movieId}</span> : null}
        </div>
        <div className="field">
          <label htmlFor="show-theater">Theater</label>
          <select id="show-theater" className="select" value={form.theaterId} onChange={(e) => setForm({ ...form, theaterId: e.target.value })}>
            <option value="">Select theater</option>
            {theaterOptions.map((theater) => (
              <option key={theater.id} value={theater.id}>
                {theater.name} · {theater.location}
              </option>
            ))}
          </select>
          {fieldErrors.theaterId ? <span className="field-error">{fieldErrors.theaterId}</span> : null}
        </div>
        <div className="field">
          <label htmlFor="show-time">Date and time</label>
          <input id="show-time" className="input" type="datetime-local" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
          {fieldErrors.time ? <span className="field-error">{fieldErrors.time}</span> : null}
        </div>
        <div className="field">
          <label htmlFor="show-price">Price (₹)</label>
          <input id="show-price" className="input" type="number" min="0" step="1" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          {fieldErrors.price ? <span className="field-error">{fieldErrors.price}</span> : null}
        </div>
        <div className="btn-row full">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving…' : editingId ? 'Update show' : 'Create show'}
          </Button>
          {editingId ? (
            <Button variant="secondary" onClick={() => { setEditingId(null); setForm(EMPTY_FORM) }}>
              Cancel edit
            </Button>
          ) : null}
        </div>
      </form>

      <form className="filters" onSubmit={loadTheatersByLocation}>
        <div className="field" style={{ gridColumn: '1 / span 3' }}>
          <label htmlFor="show-location">Load theaters by location</label>
          <input id="show-location" className="input" value={locationQuery} onChange={(e) => setLocationQuery(e.target.value)} placeholder="Needed because there is no get-all-theaters API" />
        </div>
        <div className="field" style={{ justifyContent: 'end' }}>
          <label>&nbsp;</label>
          <Button type="submit" variant="secondary">Load theaters</Button>
        </div>
      </form>

      <PageState loading={loading} error={error} onRetry={load} empty={!shows.length} emptyTitle="No shows scheduled">
        <div className="table-wrap panel">
          <table>
            <thead>
              <tr>
                <th>Movie</th>
                <th>Theater</th>
                <th>Time</th>
                <th>Price</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {shows.map((show) => (
                <tr key={show.id}>
                  <td>{show.movie?.name || '—'}</td>
                  <td>
                    {show.theater?.name || '—'}
                    <div className="dim">{show.theater?.location}</div>
                  </td>
                  <td>{formatDateTime(show.time)}</td>
                  <td>{formatPrice(show.price)}</td>
                  <td>
                    <div className="btn-row">
                      <Button variant="secondary" onClick={() => startEdit(show)}>Edit</Button>
                      <Button variant="danger" onClick={() => handleDelete(show)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PageState>
    </div>
  )
}

import { useState } from 'react'
import { addTheater, deleteTheater, getTheatersByLocation, updateTheater } from '../../api/theaterApi'
import { Button } from '../../components/common/Button'
import Alert from '../../components/common/Alert'
import PageState from '../../components/common/PageState'
import { extractErrorMessage } from '../../utils/errors'

const EMPTY_FORM = {
  name: '',
  location: '',
  seatCapacity: '',
  screenType: '',
}

export default function AdminTheatersPage() {
  const [query, setQuery] = useState('')
  const [theaters, setTheaters] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [searched, setSearched] = useState(false)

  async function search(locationValue = query) {
    const location = locationValue.trim()
    if (!location) {
      setError('Search by location to load existing theaters. There is no list-all endpoint.')
      return
    }
    setLoading(true)
    setError('')
    setSearched(true)
    try {
      setTheaters(await getTheatersByLocation(location))
    } catch (err) {
      setError(err.displayMessage || extractErrorMessage(err))
      setTheaters([])
    } finally {
      setLoading(false)
    }
  }

  function validate() {
    const next = {}
    if (!form.name.trim()) next.name = 'Name is required.'
    if (!form.location.trim()) next.location = 'Location is required.'
    if (!form.screenType.trim()) next.screenType = 'Screen type is required.'
    const capacity = Number(form.seatCapacity)
    if (!Number.isInteger(capacity) || capacity <= 0) next.seatCapacity = 'Seat capacity must be a positive whole number.'
    setFieldErrors(next)
    return Object.keys(next).length === 0
  }

  function payload() {
    return {
      name: form.name.trim(),
      location: form.location.trim(),
      seatCapacity: Number(form.seatCapacity),
      screenType: form.screenType.trim(),
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
        await updateTheater(editingId, payload())
        setSuccess('Theater updated.')
      } else {
        await addTheater(payload())
        setSuccess('Theater added.')
      }
      const location = form.location.trim()
      setForm(EMPTY_FORM)
      setEditingId(null)
      setQuery(location)
      await search(location)
    } catch (err) {
      setFormError(err.displayMessage || extractErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  function startEdit(theater) {
    setEditingId(theater.id)
    setForm({
      name: theater.name || '',
      location: theater.location || '',
      seatCapacity: theater.seatCapacity ?? '',
      screenType: theater.screenType || '',
    })
  }

  async function handleDelete(theater) {
    if (!window.confirm(`Delete “${theater.name}”?`)) return
    try {
      await deleteTheater(theater.id)
      if (editingId === theater.id) {
        setEditingId(null)
        setForm(EMPTY_FORM)
      }
      await search(theater.location || query)
    } catch (err) {
      setFormError(err.displayMessage || extractErrorMessage(err))
    }
  }

  return (
    <div>
      <p className="kicker">Admin</p>
      <h1 className="page-title">Theaters</h1>
      <p className="lede">Create venues here, then search by location to edit or delete them.</p>
      <Alert type="error">{formError}</Alert>
      <Alert type="success">{success}</Alert>

      <form className="panel padded form-grid mt-lg" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="th-name">Name</label>
          <input id="th-name" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          {fieldErrors.name ? <span className="field-error">{fieldErrors.name}</span> : null}
        </div>
        <div className="field">
          <label htmlFor="th-location">Location</label>
          <input id="th-location" className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          {fieldErrors.location ? <span className="field-error">{fieldErrors.location}</span> : null}
        </div>
        <div className="field">
          <label htmlFor="th-capacity">Seat capacity</label>
          <input id="th-capacity" className="input" type="number" min="1" value={form.seatCapacity} onChange={(e) => setForm({ ...form, seatCapacity: e.target.value })} />
          {fieldErrors.seatCapacity ? <span className="field-error">{fieldErrors.seatCapacity}</span> : null}
        </div>
        <div className="field">
          <label htmlFor="th-screen">Screen type</label>
          <input id="th-screen" className="input" value={form.screenType} onChange={(e) => setForm({ ...form, screenType: e.target.value })} placeholder="e.g. IMAX, Dolby, Standard" />
          {fieldErrors.screenType ? <span className="field-error">{fieldErrors.screenType}</span> : null}
        </div>
        <div className="btn-row full">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving…' : editingId ? 'Update theater' : 'Add theater'}
          </Button>
          {editingId ? (
            <Button variant="secondary" onClick={() => { setEditingId(null); setForm(EMPTY_FORM) }}>
              Cancel edit
            </Button>
          ) : null}
        </div>
      </form>

      <form
        className="filters mt-lg"
        onSubmit={(event) => {
          event.preventDefault()
          search()
        }}
      >
        <div className="field" style={{ gridColumn: '1 / span 3' }}>
          <label htmlFor="th-search">Find by location</label>
          <input id="th-search" className="input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Location used when the theater was saved" />
        </div>
        <div className="field" style={{ justifyContent: 'end' }}>
          <label>&nbsp;</label>
          <Button type="submit">Search</Button>
        </div>
      </form>

      <PageState
        loading={loading}
        error={error}
        onRetry={() => search()}
        empty={searched && !theaters.length}
        emptyTitle="No theaters for that location"
      >
        {theaters.length ? (
          <div className="table-wrap panel">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Capacity</th>
                  <th>Screen</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {theaters.map((theater) => (
                  <tr key={theater.id}>
                    <td>{theater.name}</td>
                    <td>{theater.location}</td>
                    <td>{theater.seatCapacity}</td>
                    <td>{theater.screenType}</td>
                    <td>
                      <div className="btn-row">
                        <Button variant="secondary" onClick={() => startEdit(theater)}>Edit</Button>
                        <Button variant="danger" onClick={() => handleDelete(theater)}>Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </PageState>
    </div>
  )
}

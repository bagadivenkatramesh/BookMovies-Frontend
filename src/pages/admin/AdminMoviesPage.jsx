import { useEffect, useState } from 'react'
import { addMovie, deleteMovie, getAllMovies, updateMovie } from '../../api/movieApi'
import { Button } from '../../components/common/Button'
import Alert from '../../components/common/Alert'
import PageState from '../../components/common/PageState'
import { extractErrorMessage } from '../../utils/errors'
import { formatDuration } from '../../utils/formatters'

const EMPTY_FORM = {
  name: '',
  description: '',
  genre: '',
  language: '',
  releaseDate: '',
  duration: '',
}

export default function AdminMoviesPage() {
  const [movies, setMovies] = useState([])
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
      setMovies(await getAllMovies())
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
        const data = await getAllMovies()
        if (!cancelled) {
          setMovies(data)
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

  function validate() {
    const next = {}
    if (!form.name.trim()) next.name = 'Name is required.'
    if (!form.description.trim()) next.description = 'Description is required.'
    if (!form.genre.trim()) next.genre = 'Genre is required.'
    if (!form.language.trim()) next.language = 'Language is required.'
    if (!form.releaseDate) next.releaseDate = 'Release date is required.'
    const duration = Number(form.duration)
    if (!Number.isFinite(duration) || duration <= 0) next.duration = 'Duration must be a positive number of minutes.'
    setFieldErrors(next)
    return Object.keys(next).length === 0
  }

  function payload() {
    return {
      name: form.name.trim(),
      description: form.description.trim(),
      genre: form.genre.trim(),
      language: form.language.trim(),
      releaseDate: form.releaseDate,
      duration: Number(form.duration),
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
        await updateMovie(editingId, payload())
        setSuccess('Movie updated.')
      } else {
        await addMovie(payload())
        setSuccess('Movie added.')
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

  function startEdit(movie) {
    setEditingId(movie.id)
    setForm({
      name: movie.name || '',
      description: movie.description || '',
      genre: movie.genre || '',
      language: movie.language || '',
      releaseDate: movie.releaseDate || '',
      duration: movie.duration ?? '',
    })
    setSuccess('')
    setFormError('')
  }

  async function handleDelete(movie) {
    if (!window.confirm(`Delete “${movie.name}”?`)) return
    setFormError('')
    try {
      await deleteMovie(movie.id)
      if (editingId === movie.id) {
        setEditingId(null)
        setForm(EMPTY_FORM)
      }
      await load()
    } catch (err) {
      setFormError(err.displayMessage || extractErrorMessage(err))
    }
  }

  return (
    <div>
      <p className="kicker">Admin</p>
      <h1 className="page-title">Movies</h1>
      <Alert type="error">{formError}</Alert>
      <Alert type="success">{success}</Alert>

      <form className="panel padded form-grid mt-lg" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="movie-name">Name</label>
          <input id="movie-name" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          {fieldErrors.name ? <span className="field-error">{fieldErrors.name}</span> : null}
        </div>
        <div className="field">
          <label htmlFor="movie-genre">Genre</label>
          <input id="movie-genre" className="input" value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} />
          {fieldErrors.genre ? <span className="field-error">{fieldErrors.genre}</span> : null}
        </div>
        <div className="field">
          <label htmlFor="movie-language">Language</label>
          <input id="movie-language" className="input" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} />
          {fieldErrors.language ? <span className="field-error">{fieldErrors.language}</span> : null}
        </div>
        <div className="field">
          <label htmlFor="movie-date">Release date</label>
          <input id="movie-date" className="input" type="date" value={form.releaseDate} onChange={(e) => setForm({ ...form, releaseDate: e.target.value })} />
          {fieldErrors.releaseDate ? <span className="field-error">{fieldErrors.releaseDate}</span> : null}
        </div>
        <div className="field">
          <label htmlFor="movie-duration">Duration (minutes)</label>
          <input id="movie-duration" className="input" type="number" min="1" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
          {fieldErrors.duration ? <span className="field-error">{fieldErrors.duration}</span> : null}
        </div>
        <div className="field full">
          <label htmlFor="movie-description">Description</label>
          <textarea id="movie-description" className="textarea" rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          {fieldErrors.description ? <span className="field-error">{fieldErrors.description}</span> : null}
        </div>
        <div className="btn-row full">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving…' : editingId ? 'Update movie' : 'Add movie'}
          </Button>
          {editingId ? (
            <Button
              variant="secondary"
              onClick={() => {
                setEditingId(null)
                setForm(EMPTY_FORM)
              }}
            >
              Cancel edit
            </Button>
          ) : null}
        </div>
      </form>

      <div className="mt-lg">
        <PageState loading={loading} error={error} onRetry={load} empty={!movies.length} emptyTitle="No movies yet">
          <div className="table-wrap panel">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Genre</th>
                  <th>Language</th>
                  <th>Duration</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {movies.map((movie) => (
                  <tr key={movie.id}>
                    <td>{movie.name}</td>
                    <td>{movie.genre}</td>
                    <td>{movie.language}</td>
                    <td>{formatDuration(movie.duration)}</td>
                    <td>
                      <div className="btn-row">
                        <Button variant="secondary" onClick={() => startEdit(movie)}>
                          Edit
                        </Button>
                        <Button variant="danger" onClick={() => handleDelete(movie)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PageState>
      </div>
    </div>
  )
}

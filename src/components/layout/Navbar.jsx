import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../common/Button'

export default function Navbar() {
  const { isAuthenticated, isAdmin, currentUser, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    setOpen(false)
    navigate('/')
  }

  return (
    <header className={`navbar ${open ? 'open' : ''}`}>
      <div className="navbar-inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">BM</span>
          BookMovies
        </Link>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={() => setOpen((value) => !value)}
        >
          Menu
        </button>

        <nav className="nav-links" onClick={() => setOpen(false)}>
          <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Home
          </NavLink>
          <NavLink to="/movies" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Movies
          </NavLink>
          <NavLink to="/theaters" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Theaters
          </NavLink>
          {isAuthenticated ? (
            <NavLink to="/my-bookings" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              My Bookings
            </NavLink>
          ) : null}
          {isAdmin ? (
            <NavLink to="/admin" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              Admin
            </NavLink>
          ) : null}
        </nav>

        <div className={`nav-actions ${open ? '' : 'collapse'}`}>
          {isAuthenticated ? (
            <>
              <div className="user-chip">
                <span className="avatar">{(currentUser?.username || 'U').slice(0, 2).toUpperCase()}</span>
                <span className="user-meta">
                  <strong>{currentUser?.username}</strong>
                  <small>{currentUser?.email}</small>
                </span>
              </div>
              <Button variant="secondary" onClick={handleLogout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link className="btn-secondary" to="/login" onClick={() => setOpen(false)}>
                Sign in
              </Link>
              <Link className="btn" to="/register" onClick={() => setOpen(false)}>
                Create account
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

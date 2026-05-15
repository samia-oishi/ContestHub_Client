import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router'
import { Moon, Sun } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const links = [
  ['Home', '/'],
  ['All Contests', '/all-contests'],
  ['Leaderboard', '/leaderboard'],
  ['How It Works', '/how-it-works'],
  ['Success Stories', '/success-stories'],
]

export function Navbar() {
  const { user, logout } = useAuth()
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'contesthub')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <header className="sticky top-0 z-40 border-b border-base-300 bg-base-100/95 backdrop-blur">
      <div className="navbar page-shell min-h-16 px-0">
        <div className="navbar-start">
          <Link to="/" className="text-xl font-bold text-primary">
            ContestHub
          </Link>
        </div>
        <nav className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-1 px-1">
            {links.map(([label, path]) => (
              <li key={path}>
                <NavLink to={path}>{label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="navbar-end gap-2">
          <button
            className="btn btn-ghost btn-square"
            onClick={() => setTheme((current) => (current === 'contesthub' ? 'contesthubdark' : 'contesthub'))}
            aria-label="Toggle theme"
          >
            {theme === 'contesthub' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          {user ? (
            <div className="dropdown dropdown-end">
              <button className="avatar btn btn-ghost btn-circle">
                <div className="w-9 rounded-full">
                  <img src={user.photoURL || '/favicon.svg'} alt={user.displayName || 'User'} />
                </div>
              </button>
              <ul className="menu dropdown-content mt-3 w-56 rounded-lg border border-base-300 bg-base-100 p-2 shadow-soft">
                <li className="px-3 py-2 text-sm font-medium">{user.displayName || user.email}</li>
                <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <button onClick={logout}>Logout</button>
                </li>
              </ul>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

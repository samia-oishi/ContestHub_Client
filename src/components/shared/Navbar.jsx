import { Link, NavLink } from 'react-router'
import { Menu } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../hooks/useAuth'
import { ThemeToggle } from './ThemeToggle'

const links = [
  ['Home', '/'],
  ['All Contests', '/all-contests'],
  ['Leaderboard', '/leaderboard'],
  ['How It Works', '/how-it-works'],
  ['Success Stories', '/success-stories'],
]

export function Navbar() {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully')
    } catch {
      toast.error('Logout failed')
    }
  }

  return (
    <header className="app-navbar">
      <div className="navbar page-shell min-h-16 px-0">
        <div className="navbar-start">
          <div className="dropdown lg:hidden">
            <button className="btn btn-ghost btn-square text-blue-800 dark:text-blue-200" type="button">
              <Menu size={20} />
            </button>
            <ul className="menu dropdown-content app-menu z-50 mt-3 w-64">
              {links.map(([label, path]) => (
                <li key={path}>
                  <NavLink to={path} className={({ isActive }) => (isActive ? 'text-blue-800 dark:text-blue-200' : '')}>{label}</NavLink>
                </li>
              ))}
            </ul>
          </div>
          <Link to="/" className="brand-logo text-xl font-bold">
            ContestHub
          </Link>
        </div>
        <nav className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-1 px-1">
            {links.map(([label, path]) => (
              <li key={path}>
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    isActive ? 'nav-link nav-link-active' : 'nav-link'
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="navbar-end gap-2">
          <ThemeToggle />
          {user ? (
            <div className="dropdown dropdown-end">
              <button className="avatar btn btn-ghost btn-circle">
                <div className="w-9 rounded-full">
                  <img src={user.photoURL || '/favicon.svg'} alt={user.displayName || 'User'} />
                </div>
              </button>
              <ul className="menu dropdown-content app-menu mt-3 w-56">
                <li className="px-3 py-2 text-sm font-medium">{user.displayName || user.email}</li>
                <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            </div>
          ) : (
            <Link to="/login" className="btn-brand btn-sm">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

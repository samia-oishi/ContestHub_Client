import { NavLink, Outlet, useNavigate } from 'react-router'
import { LayoutDashboard, LogOut } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../hooks/useAuth'
import { ThemeToggle } from '../shared/ThemeToggle'

const navByRole = {
  user: [
    ['My Contests', '/dashboard/my-contests'],
    ['Winning Contests', '/dashboard/winning-contests'],
    ['Profile', '/dashboard/profile'],
  ],
  creator: [
    ['Add Contest', '/dashboard/add-contest'],
    ['My Created Contests', '/dashboard/my-created-contests'],
    ['Submissions', '/dashboard/submissions'],
  ],
  admin: [
    ['Manage Users', '/dashboard/manage-users'],
    ['Manage Contests', '/dashboard/manage-contests'],
  ],
}

export function DashboardLayout() {
  const { role, profile, logout } = useAuth()
  const navigate = useNavigate()
  const navItems = navByRole[role] || navByRole.user

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully')
      navigate('/login')
    } catch {
      toast.error('Logout failed')
    }
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="drawer lg:drawer-open">
        <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <header className="sticky top-0 z-20 border-b border-base-300 bg-base-100/95 backdrop-blur">
            <div className="flex h-16 items-center gap-3 px-4">
              <label htmlFor="dashboard-drawer" className="btn btn-ghost btn-square lg:hidden">
                <LayoutDashboard size={20} />
              </label>
              <h1 className="text-lg font-semibold">Dashboard</h1>
              <span className="badge badge-outline capitalize">{role}</span>
              {profile?.email ? <span className="hidden text-sm text-base-content/60 sm:inline">{profile.email}</span> : null}
              <div className="ml-auto flex items-center gap-2">
                <ThemeToggle />
                <button className="btn btn-ghost btn-square" onClick={handleLogout} title="Logout" aria-label="Logout">
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </header>
          <section className="p-4 sm:p-6">
            <Outlet />
          </section>
        </div>
        <aside className="drawer-side z-30">
          <label htmlFor="dashboard-drawer" className="drawer-overlay" />
          <nav className="min-h-full w-72 border-r border-base-300 bg-base-100 p-4">
            <NavLink to="/" className="mb-6 block text-xl font-bold text-primary">
              ContestHub
            </NavLink>
            <div className="space-y-1">
              {navItems.map(([label, path]) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) =>
                    `btn btn-ghost w-full justify-start ${isActive ? 'bg-base-200 text-primary' : ''}`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </div>
            <div className="mt-6 border-t border-base-300 pt-4">
              <button className="btn btn-outline w-full justify-start" onClick={handleLogout}>
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </nav>
        </aside>
      </div>
    </div>
  )
}

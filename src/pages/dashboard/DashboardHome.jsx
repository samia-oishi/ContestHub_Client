import { Link } from 'react-router'
import { useAuth } from '../../hooks/useAuth'

const actionsByRole = {
  user: [
    ['My Participated Contests', '/dashboard/my-contests', 'Track contests you registered for.'],
    ['My Winning Contests', '/dashboard/winning-contests', 'Review prizes and wins.'],
  ],
  creator: [
    ['Add Contest', '/dashboard/add-contest', 'Submit a new contest for admin approval.'],
    ['My Created Contests', '/dashboard/my-created-contests', 'Edit or delete pending contests.'],
    ['Submitted Tasks', '/dashboard/submissions', 'Review participant submissions.'],
  ],
  admin: [
    ['Manage Users', '/dashboard/manage-users', 'Change user roles and review accounts.'],
    ['Manage Contests', '/dashboard/manage-contests', 'Approve, reject, or delete contests.'],
  ],
}

export function DashboardHome() {
  const { profile, role } = useAuth()
  const actions = actionsByRole[role] || actionsByRole.user

  return (
    <div className="space-y-5">
      <div className="surface p-6">
        <p className="text-sm font-medium capitalize text-primary">{role} dashboard</p>
        <h1 className="mt-2 text-2xl font-semibold">Welcome{profile?.name ? `, ${profile.name}` : ''}</h1>
        <p className="mt-2 text-base-content/70">
          Choose a dashboard action below. Contest creation is available from creator accounts.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {actions.map(([title, path, description]) => (
          <Link key={path} to={path} className="surface block p-5 transition hover:border-primary/60 hover:shadow-md">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-2 text-sm text-base-content/70">{description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

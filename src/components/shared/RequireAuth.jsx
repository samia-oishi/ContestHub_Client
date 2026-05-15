import { Navigate, useLocation } from 'react-router'
import { useAuth } from '../../hooks/useAuth'

export function RequireAuth({ children, roles }) {
  const { user, role, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div className="page-shell py-20">Loading account...</div>
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (roles?.length && !roles.includes(role)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

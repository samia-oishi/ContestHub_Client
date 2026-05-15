import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import { useAuth } from '../../hooks/useAuth'
import { getFirebaseErrorMessage } from '../../utils/firebaseErrors'

const loginRoles = [
  { value: 'user', label: 'User', note: 'Join contests and submit tasks' },
  { value: 'creator', label: 'Creator', note: 'Create contests and declare winners' },
  { value: 'admin', label: 'Admin', note: 'Approve contests and manage users' },
]

export function Login() {
  const { user, loginWithEmail, loginWithGoogle } = useAuth()
  const [selectedRole, setSelectedRole] = useState('user')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  if (user) {
    return <Navigate to={from} replace />
  }

  const handleRoleNotice = (profile) => {
    if (selectedRole === 'admin' && profile?.role !== 'admin') {
      toast('Admin access is only available for accounts assigned by an admin.')
      return
    }

    if (selectedRole === 'creator' && profile?.role !== 'creator') {
      toast('This account is not a creator yet. Admin can update the role later.')
    }
  }

  const onSubmit = async (values) => {
    setSubmitting(true)
    try {
      const profile = await loginWithEmail(values)
      handleRoleNotice(profile)
      toast.success('Logged in successfully')
      navigate(from, { replace: true })
    } catch (error) {
      toast.error(getFirebaseErrorMessage(error, 'Login failed'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoogleLogin = async () => {
    setSubmitting(true)
    try {
      const profile = await loginWithGoogle(selectedRole)
      if (!profile) {
        toast('Redirecting to Google sign-in...')
        return
      }
      handleRoleNotice(profile)
      toast.success('Logged in successfully')
      navigate(from, { replace: true })
    } catch (error) {
      toast.error(getFirebaseErrorMessage(error, 'Google login failed'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="min-h-[calc(100vh-9rem)] bg-base-200 py-8 sm:py-12">
      <div className="page-shell grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="space-y-4">
          <p className="text-sm font-medium text-primary">Choose your access</p>
          <h1 className="text-3xl font-semibold">Login to ContestHub</h1>
          <p className="max-w-xl text-base-content/70">
            Use the same secure login form. Your dashboard access is decided by your saved account role.
          </p>
          <div className="grid gap-3">
            {loginRoles.map((role) => (
              <button
                key={role.value}
                type="button"
                className={`rounded-lg border p-4 text-left transition ${
                  selectedRole === role.value
                    ? 'border-primary bg-primary/10 text-base-content'
                    : 'border-base-300 bg-base-100 hover:border-primary/50'
                }`}
                onClick={() => setSelectedRole(role.value)}
              >
                <span className="block font-semibold">{role.label} Login</span>
                <span className="mt-1 block text-sm text-base-content/65">{role.note}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="surface w-full p-5 sm:p-7">
          <h2 className="text-2xl font-semibold">{loginRoles.find((role) => role.value === selectedRole)?.label} Login</h2>
          <p className="mt-2 text-sm text-base-content/70">Enter your credentials to continue.</p>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="mb-1.5 block text-sm font-medium" htmlFor="login-email">
                Email
              </label>
              <input
                id="login-email"
                className="input input-bordered w-full"
                type="email"
                placeholder="you@example.com"
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && <p className="mt-1.5 text-sm text-error">{errors.email.message}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium" htmlFor="login-password">
                Password
              </label>
              <input
                id="login-password"
                className="input input-bordered w-full"
                type="password"
                placeholder="Your password"
                {...register('password', { required: 'Password is required' })}
              />
              {errors.password && <p className="mt-1.5 text-sm text-error">{errors.password.message}</p>}
            </div>

            <button className="btn btn-primary w-full" disabled={submitting}>
              {submitting ? 'Signing in...' : 'Login'}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wide text-base-content/50">
            <span className="h-px flex-1 bg-base-300" />
            or
            <span className="h-px flex-1 bg-base-300" />
          </div>

          <button className="btn btn-outline w-full" onClick={handleGoogleLogin} disabled={submitting}>
            Continue with Google
          </button>

          <p className="mt-5 text-center text-sm text-base-content/70">
            Need a user or creator account?{' '}
            <Link className="font-medium text-primary" to="/register">
              Register
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}

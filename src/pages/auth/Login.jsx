import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import { useAuth } from '../../hooks/useAuth'

export function Login() {
  const { user, loginWithEmail, loginWithGoogle } = useAuth()
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

  const onSubmit = async (values) => {
    setSubmitting(true)
    try {
      await loginWithEmail(values)
      toast.success('Logged in successfully')
      navigate(from, { replace: true })
    } catch (error) {
      toast.error(error.message || 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoogleLogin = async () => {
    setSubmitting(true)
    try {
      await loginWithGoogle()
      toast.success('Logged in successfully')
      navigate(from, { replace: true })
    } catch (error) {
      toast.error(error.message || 'Google login failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="page-shell flex min-h-[70vh] items-center justify-center py-10">
      <div className="surface w-full max-w-md p-6">
        <h1 className="text-2xl font-semibold">Login</h1>
        <p className="mt-2 text-sm text-base-content/70">Access your contests, submissions, and dashboard.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <label className="form-control">
            <span className="label-text">Email</span>
            <input
              className="input input-bordered mt-1"
              type="email"
              placeholder="you@example.com"
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && <span className="mt-1 text-sm text-error">{errors.email.message}</span>}
          </label>

          <label className="form-control">
            <span className="label-text">Password</span>
            <input
              className="input input-bordered mt-1"
              type="password"
              placeholder="Your password"
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && <span className="mt-1 text-sm text-error">{errors.password.message}</span>}
          </label>

          <button className="btn btn-primary w-full" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <div className="divider">or</div>

        <button className="btn btn-outline w-full" onClick={handleGoogleLogin} disabled={submitting}>
          Continue with Google
        </button>

        <p className="mt-5 text-center text-sm text-base-content/70">
          New to ContestHub?{' '}
          <Link className="font-medium text-primary" to="/register">
            Create an account
          </Link>
        </p>
      </div>
    </section>
  )
}

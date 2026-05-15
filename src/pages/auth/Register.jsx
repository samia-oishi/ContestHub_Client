import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Link, Navigate, useNavigate } from 'react-router'
import { useAuth } from '../../hooks/useAuth'

export function Register() {
  const { user, registerWithEmail } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  const onSubmit = async (values) => {
    setSubmitting(true)
    try {
      await registerWithEmail(values)
      toast.success('Account created successfully')
      navigate('/dashboard', { replace: true })
    } catch (error) {
      toast.error(error.message || 'Registration failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="page-shell flex min-h-[70vh] items-center justify-center py-10">
      <div className="surface w-full max-w-lg p-6">
        <h1 className="text-2xl font-semibold">Create account</h1>
        <p className="mt-2 text-sm text-base-content/70">Join contests, submit your work, and track your wins.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <label className="form-control">
            <span className="label-text">Name</span>
            <input
              className="input input-bordered mt-1"
              placeholder="Your name"
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && <span className="mt-1 text-sm text-error">{errors.name.message}</span>}
          </label>

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
            <span className="label-text">Photo URL</span>
            <input
              className="input input-bordered mt-1"
              placeholder="https://example.com/photo.jpg"
              {...register('photoURL', { required: 'Photo URL is required' })}
            />
            {errors.photoURL && <span className="mt-1 text-sm text-error">{errors.photoURL.message}</span>}
          </label>

          <label className="form-control">
            <span className="label-text">Password</span>
            <input
              className="input input-bordered mt-1"
              type="password"
              placeholder="At least 6 characters"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
            />
            {errors.password && <span className="mt-1 text-sm text-error">{errors.password.message}</span>}
          </label>

          <button className="btn btn-primary w-full" disabled={submitting}>
            {submitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-base-content/70">
          Already have an account?{' '}
          <Link className="font-medium text-primary" to="/login">
            Login
          </Link>
        </p>
      </div>
    </section>
  )
}

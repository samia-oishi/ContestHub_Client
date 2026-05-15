import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Link, Navigate, useNavigate } from 'react-router'
import { useAuth } from '../../hooks/useAuth'
import { getFirebaseErrorMessage } from '../../utils/firebaseErrors'

const registerRoles = [
  { value: 'user', label: 'User', note: 'Participate in contests after payment' },
  { value: 'creator', label: 'Contest Creator', note: 'Create and manage contests after login' },
]

export function Register() {
  const { user, registerWithEmail } = useAuth()
  const [selectedRole, setSelectedRole] = useState('user')
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
      await registerWithEmail({ ...values, role: selectedRole })
      toast.success('Account created successfully')
      navigate('/dashboard', { replace: true })
    } catch (error) {
      toast.error(getFirebaseErrorMessage(error, 'Registration failed'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="min-h-[calc(100vh-9rem)] bg-base-200 py-8 sm:py-12">
      <div className="page-shell grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="space-y-4">
          <p className="text-sm font-medium text-primary">Create your account</p>
          <h1 className="text-3xl font-semibold">Register for ContestHub</h1>
          <p className="max-w-xl text-base-content/70">
            Pick the account type you need. Admin accounts are assigned from the admin dashboard, not public registration.
          </p>
          <div className="grid gap-3">
            {registerRoles.map((role) => (
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
                <span className="block font-semibold">{role.label}</span>
                <span className="mt-1 block text-sm text-base-content/65">{role.note}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="surface w-full p-5 sm:p-7">
          <h2 className="text-2xl font-semibold">{registerRoles.find((role) => role.value === selectedRole)?.label} Registration</h2>
          <p className="mt-2 text-sm text-base-content/70">Use real profile information so dashboards and winner displays look complete.</p>

          <form className="mt-6 grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium" htmlFor="register-name">
                Name
              </label>
              <input
                id="register-name"
                className="input input-bordered w-full"
                placeholder="Your name"
                {...register('name', { required: 'Name is required' })}
              />
              {errors.name && <p className="mt-1.5 text-sm text-error">{errors.name.message}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium" htmlFor="register-email">
                Email
              </label>
              <input
                id="register-email"
                className="input input-bordered w-full"
                type="email"
                placeholder="you@example.com"
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && <p className="mt-1.5 text-sm text-error">{errors.email.message}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium" htmlFor="register-password">
                Password
              </label>
              <input
                id="register-password"
                className="input input-bordered w-full"
                type="password"
                placeholder="At least 6 characters"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' },
                })}
              />
              {errors.password && <p className="mt-1.5 text-sm text-error">{errors.password.message}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium" htmlFor="register-photo">
                Photo URL
              </label>
              <input
                id="register-photo"
                className="input input-bordered w-full"
                placeholder="https://example.com/photo.jpg"
                {...register('photoURL', { required: 'Photo URL is required' })}
              />
              {errors.photoURL && <p className="mt-1.5 text-sm text-error">{errors.photoURL.message}</p>}
            </div>

            <div className="sm:col-span-2">
              <button className="btn btn-primary w-full" disabled={submitting}>
                {submitting ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>

          <p className="mt-5 text-center text-sm text-base-content/70">
            Already have an account?{' '}
            <Link className="font-medium text-primary" to="/login">
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}

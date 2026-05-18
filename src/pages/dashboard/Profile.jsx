import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { getProfileStats, updateMyProfile } from '../../api/userApi'
import { LoadingState } from '../../components/shared/LoadingState'
import { useAuth } from '../../hooks/useAuth'

const chartColors = ['#0f766e', '#cbd5e1']

export function Profile() {
  const { profile, updateAuthProfile } = useAuth()
  const queryClient = useQueryClient()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['profile-stats'],
    queryFn: getProfileStats,
  })

  useEffect(() => {
    if (!profile) return

    reset({
      name: profile.name || '',
      photoURL: profile.photoURL || '',
      bio: profile.bio || '',
      address: profile.address || '',
    })
  }, [profile, reset])

  const profileMutation = useMutation({
    mutationFn: updateMyProfile,
    onSuccess: async (updatedProfile) => {
      updateAuthProfile?.(updatedProfile)
      await queryClient.invalidateQueries({ queryKey: ['profile-stats'] })
      toast.success('Profile updated')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Profile update failed')
    },
  })

  const onSubmit = (values) => {
    profileMutation.mutate(values)
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">My Profile</h1>
        <p className="mt-1 text-sm text-base-content/70">Keep your profile ready for dashboards and winner displays.</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
        <form className="surface space-y-4 p-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center gap-4">
            <img className="h-16 w-16 rounded-full border border-base-300 object-cover" src={profile?.photoURL || '/favicon.svg'} alt={profile?.name || 'Profile'} />
            <div>
              <p className="font-medium">{profile?.email}</p>
              <p className="text-sm capitalize text-base-content/60">{profile?.role}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="label" htmlFor="name"><span className="label-text">Name</span></label>
              <input id="name" className="input input-bordered w-full" {...register('name', { required: 'Name is required' })} />
              {errors.name ? <p className="mt-1 text-sm text-error">{errors.name.message}</p> : null}
            </div>
            <div>
              <label className="label" htmlFor="photoURL"><span className="label-text">Photo URL</span></label>
              <input id="photoURL" className="input input-bordered w-full" {...register('photoURL')} />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="address"><span className="label-text">Address</span></label>
            <input id="address" className="input input-bordered w-full" {...register('address', { maxLength: { value: 160, message: 'Address is too long' } })} />
            {errors.address ? <p className="mt-1 text-sm text-error">{errors.address.message}</p> : null}
          </div>

          <div>
            <label className="label" htmlFor="bio"><span className="label-text">Bio</span></label>
            <textarea id="bio" className="textarea textarea-bordered min-h-28 w-full" {...register('bio', { maxLength: { value: 300, message: 'Bio is too long' } })} />
            {errors.bio ? <p className="mt-1 text-sm text-error">{errors.bio.message}</p> : null}
          </div>

          <button className="btn btn-primary" disabled={profileMutation.isPending} type="submit">
            {profileMutation.isPending ? 'Saving...' : 'Save profile'}
          </button>
        </form>

        <div className="surface p-6">
          <h2 className="text-xl font-semibold">Win percentage</h2>
          {statsLoading ? <LoadingState label="Loading stats..." /> : null}
          {!statsLoading ? (
            <>
              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg border border-base-300 p-3">
                  <p className="text-2xl font-semibold">{stats?.participated || 0}</p>
                  <p className="text-xs text-base-content/60">Joined</p>
                </div>
                <div className="rounded-lg border border-base-300 p-3">
                  <p className="text-2xl font-semibold">{stats?.wins || 0}</p>
                  <p className="text-xs text-base-content/60">Wins</p>
                </div>
                <div className="rounded-lg border border-base-300 p-3">
                  <p className="text-2xl font-semibold">{stats?.winPercentage || 0}%</p>
                  <p className="text-xs text-base-content/60">Rate</p>
                </div>
              </div>

              <div className="mt-6 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={stats?.chartData || []} dataKey="value" nameKey="name" innerRadius={58} outerRadius={86} paddingAngle={3}>
                      {(stats?.chartData || []).map((entry, index) => (
                        <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}

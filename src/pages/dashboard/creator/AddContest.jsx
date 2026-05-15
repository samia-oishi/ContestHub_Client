import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router'
import { createContest } from '../../../api/contestApi'
import { ContestForm } from '../../../components/forms/ContestForm'

export function AddContest() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: createContest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-created-contests'] })
      toast.success('Contest submitted for admin approval')
      navigate('/dashboard/my-created-contests')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Could not add contest')
    },
  })

  return (
    <div className="surface p-5 sm:p-6">
      <h1 className="text-2xl font-semibold">Add Contest</h1>
      <p className="mt-2 text-sm text-base-content/70">New contests stay pending until an admin approves them.</p>
      <div className="mt-6">
        <ContestForm submitting={mutation.isPending} onSubmit={mutation.mutate} />
      </div>
    </div>
  )
}

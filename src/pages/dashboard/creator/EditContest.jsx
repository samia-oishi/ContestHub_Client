import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Link, useNavigate, useParams } from 'react-router'
import { getMyContestDetails, updateContest } from '../../../api/contestApi'
import { ContestForm } from '../../../components/forms/ContestForm'
import { EmptyState } from '../../../components/shared/EmptyState'
import { LoadingState } from '../../../components/shared/LoadingState'

export function EditContest() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: contest, isLoading, isError } = useQuery({
    queryKey: ['my-contest-details', id],
    queryFn: () => getMyContestDetails(id),
    enabled: Boolean(id),
  })

  const mutation = useMutation({
    mutationFn: (payload) => updateContest(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-created-contests'] })
      toast.success('Contest updated')
      navigate('/dashboard/my-created-contests')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Could not update contest')
    },
  })

  if (isLoading) return <LoadingState label="Loading contest..." />

  if (isError || !contest) {
    return <EmptyState title="Contest unavailable" message="This contest may not exist or may not belong to you." action={<Link className="btn btn-primary" to="/dashboard/my-created-contests">Back to contests</Link>} />
  }

  if (contest.status !== 'pending') {
    return <EmptyState title="Contest cannot be edited" message="Only pending contests can be changed after submission." action={<Link className="btn btn-primary" to="/dashboard/my-created-contests">Back to contests</Link>} />
  }

  return (
    <div className="surface p-5 sm:p-6">
      <h1 className="text-2xl font-semibold">Edit Contest</h1>
      <p className="mt-2 text-sm text-base-content/70">Update the pending contest before admin approval.</p>
      <div className="mt-6">
        <ContestForm contest={contest} submitLabel="Update Contest" submitting={mutation.isPending} onSubmit={mutation.mutate} />
      </div>
    </div>
  )
}

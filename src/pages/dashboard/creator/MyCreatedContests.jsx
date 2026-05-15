import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Link } from 'react-router'
import { deleteContest, getMyCreatedContests } from '../../../api/contestApi'
import { EmptyState } from '../../../components/shared/EmptyState'
import { LoadingState } from '../../../components/shared/LoadingState'
import { formatCurrency, formatDate } from '../../../utils/formatters'

export function MyCreatedContests() {
  const queryClient = useQueryClient()
  const { data: contests = [], isLoading, isError } = useQuery({
    queryKey: ['my-created-contests'],
    queryFn: getMyCreatedContests,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteContest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-created-contests'] })
      toast.success('Contest deleted')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Could not delete contest')
    },
  })

  const handleDelete = (contest) => {
    if (!confirm(`Delete "${contest.title}"?`)) return
    deleteMutation.mutate(contest._id)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">My Created Contests</h1>
          <p className="mt-1 text-sm text-base-content/70">Edit or delete contests while they are still pending.</p>
        </div>
        <Link to="/dashboard/add-contest" className="btn btn-primary btn-sm">Add Contest</Link>
      </div>

      {isLoading ? <LoadingState label="Loading your contests..." /> : null}
      {isError ? <EmptyState title="Could not load contests" message="Please refresh or check your session." /> : null}
      {!isLoading && !isError && contests.length === 0 ? (
        <EmptyState title="No contests yet" message="Create your first contest and submit it for admin approval." action={<Link className="btn btn-primary" to="/dashboard/add-contest">Add Contest</Link>} />
      ) : null}

      {!isLoading && !isError && contests.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-base-300 bg-base-100">
          <table className="table">
            <thead>
              <tr>
                <th>Contest</th>
                <th>Type</th>
                <th>Price</th>
                <th>Deadline</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contests.map((contest) => {
                const editable = contest.status === 'pending'
                return (
                  <tr key={contest._id}>
                    <td className="font-medium">{contest.title}</td>
                    <td>{contest.type}</td>
                    <td>{formatCurrency(contest.price)}</td>
                    <td>{formatDate(contest.deadline)}</td>
                    <td><span className="badge badge-outline capitalize">{contest.status}</span></td>
                    <td>
                      <div className="flex justify-end gap-2">
                        <Link className="btn btn-outline btn-xs" to="/dashboard/submissions">See Submissions</Link>
                        <Link className={`btn btn-xs ${editable ? 'btn-primary' : 'btn-disabled'}`} to={`/dashboard/edit-contest/${contest._id}`}>Edit</Link>
                        <button className={`btn btn-xs ${editable ? 'btn-error' : 'btn-disabled'}`} onClick={() => handleDelete(contest)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  )
}

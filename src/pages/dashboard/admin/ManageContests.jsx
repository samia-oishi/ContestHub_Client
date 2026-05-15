import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { deleteContestAsAdmin, getAdminContests, updateContestStatus } from '../../../api/adminApi'
import { EmptyState } from '../../../components/shared/EmptyState'
import { LoadingState } from '../../../components/shared/LoadingState'
import { formatCurrency, formatDate } from '../../../utils/formatters'

export function ManageContests() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('all')
  const queryClient = useQueryClient()
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-contests', page, statusFilter],
    queryFn: () => getAdminContests({ page, status: statusFilter }),
  })

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-contests'] })
    queryClient.invalidateQueries({ queryKey: ['approved-contests'] })
    queryClient.invalidateQueries({ queryKey: ['popular-contests'] })
  }

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateContestStatus(id, status),
    onSuccess: () => {
      refresh()
      toast.success('Contest status updated')
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Could not update contest'),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteContestAsAdmin,
    onSuccess: () => {
      refresh()
      toast.success('Contest deleted')
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Could not delete contest'),
  })

  const contests = data?.items || []
  const totalPages = data?.totalPages || 0

  const removeContest = (contest) => {
    if (!confirm(`Delete "${contest.title}"?`)) return
    deleteMutation.mutate(contest._id)
  }

  const changeFilter = (status) => {
    setStatusFilter(status)
    setPage(1)
  }

  const renderActions = (contest) => {
    const isApproved = contest.status === 'approved'
    const isRejected = contest.status === 'rejected'

    return (
      <div className="flex flex-wrap justify-end gap-2">
        {!isApproved ? (
          <button className="btn btn-primary btn-xs" onClick={() => statusMutation.mutate({ id: contest._id, status: 'approved' })}>
            Confirm
          </button>
        ) : null}
        {!isApproved && !isRejected ? (
          <button className="btn btn-outline btn-xs" onClick={() => statusMutation.mutate({ id: contest._id, status: 'rejected' })}>
            Reject
          </button>
        ) : null}
        <button className="btn btn-error btn-xs" onClick={() => removeContest(contest)}>
          Delete
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Manage Contests</h1>
        <p className="mt-1 text-sm text-base-content/70">Approve, reject, or delete creator contests.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          ['all', 'All'],
          ['pending', 'Pending'],
          ['approved', 'Approved'],
          ['rejected', 'Rejected'],
        ].map(([value, label]) => (
          <button
            key={value}
            className={`btn btn-sm ${statusFilter === value ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => changeFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>

      {isLoading ? <LoadingState label="Loading contests..." /> : null}
      {isError ? <EmptyState title="Could not load contests" message="Please refresh or check your admin session." /> : null}
      {!isLoading && !isError && contests.length === 0 ? (
        <EmptyState
          title="No contests found"
          message={statusFilter === 'all' ? 'Creator contests will appear here after submission.' : `No ${statusFilter} contests found.`}
        />
      ) : null}

      {!isLoading && !isError && contests.length > 0 ? (
        <>
          <div className="overflow-x-auto rounded-lg border border-base-300 bg-base-100">
            <table className="table">
              <thead>
                <tr>
                  <th>Contest</th>
                  <th>Creator</th>
                  <th>Type</th>
                  <th>Prize</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contests.map((contest) => (
                  <tr key={contest._id}>
                    <td className="font-medium">{contest.title}</td>
                    <td>{contest.creatorEmail}</td>
                    <td>{contest.type}</td>
                    <td>{formatCurrency(contest.prizeMoney)}</td>
                    <td>{formatDate(contest.deadline)}</td>
                    <td><span className="badge badge-outline capitalize">{contest.status}</span></td>
                    <td>
                      {renderActions(contest)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 ? (
            <div className="flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((item) => (
                <button key={item} className={`btn btn-sm ${item === page ? 'btn-primary' : 'btn-outline'}`} onClick={() => setPage(item)}>
                  {item}
                </button>
              ))}
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  )
}

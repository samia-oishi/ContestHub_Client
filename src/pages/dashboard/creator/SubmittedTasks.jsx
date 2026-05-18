import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { declareWinner, getCreatorSubmissions } from '../../../api/submissionApi'
import { EmptyState } from '../../../components/shared/EmptyState'
import { LoadingState } from '../../../components/shared/LoadingState'
import { formatDate } from '../../../utils/formatters'

export function SubmittedTasks() {
  const queryClient = useQueryClient()
  const [pageLoadedAt] = useState(() => Date.now())
  const { data: submissions = [], isLoading, isError } = useQuery({
    queryKey: ['creator-submissions'],
    queryFn: getCreatorSubmissions,
  })
  const winnerMutation = useMutation({
    mutationFn: declareWinner,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['creator-submissions'] })
      toast.success('Winner declared')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Winner could not be declared')
    },
  })

  const canDeclareWinner = (submission) => {
    const ended = submission.contestDeadline
      ? new Date(submission.contestDeadline).getTime() <= pageLoadedAt
      : false

    return ended && !submission.contestHasWinner && !submission.isWinner
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Submitted Tasks</h1>
        <p className="mt-1 text-sm text-base-content/70">Review participant submissions for your contests.</p>
      </div>

      {isLoading ? <LoadingState label="Loading submissions..." /> : null}
      {isError ? <EmptyState title="Could not load submissions" message="Please refresh or check your session." /> : null}
      {!isLoading && !isError && submissions.length === 0 ? (
        <EmptyState title="No submissions yet" message="Submissions will appear here after users register and submit tasks." />
      ) : null}

      {!isLoading && !isError && submissions.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-base-300 bg-base-100">
          <table className="table">
            <thead>
              <tr>
                <th>Contest</th>
                <th>Participant</th>
                <th>Email</th>
                <th>Submitted</th>
                <th>Task</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission._id}>
                  <td>{submission.contestTitle}</td>
                  <td>{submission.userName}</td>
                  <td>{submission.userEmail}</td>
                  <td>{formatDate(submission.submittedAt)}</td>
                  <td>
                    <a className="link link-primary" href={submission.taskLinkOrText} target="_blank" rel="noreferrer">
                      View
                    </a>
                  </td>
                  <td><span className="badge badge-outline">{submission.isWinner ? 'Winner' : submission.status || 'Submitted'}</span></td>
                  <td>
                    <button
                      className="btn btn-outline btn-xs"
                      disabled={!canDeclareWinner(submission) || winnerMutation.isPending}
                      onClick={() => winnerMutation.mutate(submission._id)}
                    >
                      Declare Winner
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  )
}

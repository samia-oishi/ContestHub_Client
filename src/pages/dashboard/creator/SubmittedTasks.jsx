import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { declareWinner, getCreatorSubmissions } from '../../../api/submissionApi'
import { EmptyState } from '../../../components/shared/EmptyState'
import { LoadingState } from '../../../components/shared/LoadingState'
import { formatDate } from '../../../utils/formatters'

export function SubmittedTasks() {
  const queryClient = useQueryClient()
  const [openSubmission, setOpenSubmission] = useState(null)
  const [currentTime, setCurrentTime] = useState(() => Date.now())
  const { data: submissions = [], isLoading, isError } = useQuery({
    queryKey: ['creator-submissions'],
    queryFn: getCreatorSubmissions,
  })
  const winnerMutation = useMutation({
    mutationFn: declareWinner,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['creator-submissions'] }),
        queryClient.invalidateQueries({ queryKey: ['recent-winners'] }),
        queryClient.invalidateQueries({ queryKey: ['leaderboard'] }),
        queryClient.invalidateQueries({ queryKey: ['profile-stats'] }),
        queryClient.invalidateQueries({ queryKey: ['my-winning-registrations'] }),
        queryClient.invalidateQueries({ queryKey: ['my-registrations'] }),
      ])
      toast.success('Winner declared')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Winner could not be declared')
    },
  })

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 30000)
    return () => clearInterval(timer)
  }, [])

  const isContestEnded = (submission) => {
    if (!submission.contestDeadline) return false
    return new Date(submission.contestDeadline).getTime() <= currentTime
  }

  const canDeclareWinner = (submission) => {
    const ended = submission.contestDeadline
      ? isContestEnded(submission)
      : false

    return ended && !submission.contestHasWinner && !submission.isWinner
  }

  const getWinnerActionLabel = (submission) => {
    if (submission.isWinner) return 'Winner Selected'
    if (submission.contestHasWinner) return 'Winner Declared'
    if (!isContestEnded(submission)) return 'Deadline not ended'
    return 'Declare Winner'
  }

  const isUrl = (value = '') => /^https?:\/\/\S+$/i.test(value.trim())

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
                    {isUrl(submission.taskLinkOrText) ? (
                      <a className="link link-primary" href={submission.taskLinkOrText} target="_blank" rel="noreferrer">
                        View
                      </a>
                    ) : (
                      <button className="link link-primary" onClick={() => setOpenSubmission(submission)}>
                        View text
                      </button>
                    )}
                  </td>
                  <td><span className="badge badge-outline">{submission.isWinner ? 'Winner' : submission.status || 'Submitted'}</span></td>
                  <td>
                    <button
                      className="btn btn-outline btn-xs"
                      disabled={!canDeclareWinner(submission) || winnerMutation.isPending}
                      title={getWinnerActionLabel(submission)}
                      onClick={() => winnerMutation.mutate(submission._id)}
                    >
                      {getWinnerActionLabel(submission)}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {openSubmission ? (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h2 className="text-xl font-semibold">Submission</h2>
            <p className="mt-1 text-sm text-base-content/60">{openSubmission.userName} - {openSubmission.contestTitle}</p>
            <div className="mt-5 rounded-lg border border-base-300 bg-base-200 p-4">
              <p className="whitespace-pre-wrap text-sm leading-6">{openSubmission.taskLinkOrText}</p>
            </div>
            <div className="modal-action">
              <button className="btn btn-primary" onClick={() => setOpenSubmission(null)}>Close</button>
            </div>
          </div>
          <button className="modal-backdrop" type="button" onClick={() => setOpenSubmission(null)}>Close</button>
        </div>
      ) : null}
    </div>
  )
}

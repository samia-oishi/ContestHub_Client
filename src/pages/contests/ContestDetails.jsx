import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Link, useParams } from 'react-router'
import { getContestDetails } from '../../api/contestApi'
import { getRegistrationStatus } from '../../api/paymentApi'
import { createSubmission, getSubmissionStatus } from '../../api/submissionApi'
import { Countdown } from '../../components/contest/Countdown'
import { EmptyState } from '../../components/shared/EmptyState'
import { LoadingState } from '../../components/shared/LoadingState'
import { formatCurrency, formatDate } from '../../utils/formatters'

export function ContestDetails() {
  const { id } = useParams()
  const [now, setNow] = useState(() => new Date())
  const [submissionOpen, setSubmissionOpen] = useState(false)
  const queryClient = useQueryClient()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()
  const {
    data: contest,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['contest-details', id],
    queryFn: () => getContestDetails(id),
    enabled: Boolean(id),
  })
  const { data: registrationStatus } = useQuery({
    queryKey: ['registration-status', id],
    queryFn: () => getRegistrationStatus(id),
    enabled: Boolean(id),
  })
  const { data: submissionStatus } = useQuery({
    queryKey: ['submission-status', id],
    queryFn: () => getSubmissionStatus(id),
    enabled: Boolean(id),
  })

  const submissionMutation = useMutation({
    mutationFn: createSubmission,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['submission-status', id] })
      toast.success('Task submitted')
      reset()
      setSubmissionOpen(false)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Submission failed')
    },
  })

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  if (isLoading) {
    return <LoadingState label="Loading contest details..." />
  }

  if (isError || !contest) {
    return (
      <section className="page-shell py-10">
        <EmptyState title="Contest unavailable" message="This contest may not exist or may not be approved yet." action={<Link className="btn btn-primary" to="/all-contests">Browse contests</Link>} />
      </section>
    )
  }

  const ended = contest.deadline ? new Date(contest.deadline).getTime() <= now.getTime() : false
  const registered = Boolean(registrationStatus?.registered)
  const submitted = Boolean(submissionStatus?.submitted)

  const handleTaskSubmit = (values) => {
    submissionMutation.mutate({
      contestId: contest._id,
      taskLinkOrText: values.taskLinkOrText,
    })
  }

  return (
    <section className="page-shell py-10">
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-lg border border-base-300 bg-base-200">
            <img className="aspect-[16/9] w-full object-cover" src={contest.image || '/favicon.svg'} alt={contest.title} />
          </div>

          <div>
            <span className="badge badge-outline">{contest.type}</span>
            <h1 className="mt-3 text-3xl font-semibold">{contest.title}</h1>
            <p className="mt-4 text-base-content/75">{contest.description}</p>
          </div>

          <div className="surface p-5">
            <h2 className="text-xl font-semibold">Task details</h2>
            <p className="mt-3 whitespace-pre-line text-base-content/75">{contest.taskInstruction || 'Task instructions will be shared by the creator.'}</p>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="surface p-5">
            <h2 className="text-xl font-semibold">Deadline</h2>
            <p className="mt-1 text-sm text-base-content/60">{formatDate(contest.deadline)}</p>
            <div className="mt-4">
              <Countdown deadline={contest.deadline} />
            </div>
          </div>

          <div className="surface space-y-3 p-5">
            <div className="flex justify-between gap-3">
              <span className="text-base-content/70">Participants</span>
              <span className="font-semibold">{contest.participantCount || 0}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-base-content/70">Entry fee</span>
              <span className="font-semibold">{formatCurrency(contest.price || 0)}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-base-content/70">Prize money</span>
              <span className="font-semibold">{formatCurrency(contest.prizeMoney || 0)}</span>
            </div>
            <Link className={`btn mt-3 w-full ${ended || registered ? 'btn-disabled' : 'btn-primary'}`} to={`/payment/${contest._id}`}>
              {registered ? 'Registered' : ended ? 'Contest Ended' : 'Register / Pay'}
            </Link>
            <button
              className="btn btn-outline w-full"
              disabled={!registered || submitted || ended}
              type="button"
              onClick={() => setSubmissionOpen(true)}
            >
              {submitted ? 'Task Submitted' : registered ? 'Submit Task' : 'Submit after registration'}
            </button>
            {registered && submitted ? (
              <p className="text-center text-xs text-base-content/60">Your task has been submitted for creator review.</p>
            ) : null}
            {registered && ended && !submitted ? (
              <p className="text-center text-xs text-base-content/60">Submission is closed because the deadline has passed.</p>
            ) : null}
          </div>

          <div className="surface p-5">
            <h2 className="text-xl font-semibold">Winner</h2>
            {contest.winnerName ? (
              <div className="mt-4 flex items-center gap-3">
                <img className="h-12 w-12 rounded-full object-cover" src={contest.winnerPhoto || '/favicon.svg'} alt={contest.winnerName} />
                <p className="font-medium">{contest.winnerName}</p>
              </div>
            ) : (
              <p className="mt-2 text-sm text-base-content/70">Winner will be displayed after the creator declares the result.</p>
            )}
          </div>
        </aside>
      </div>

      {submissionOpen ? (
        <div className="modal modal-open">
          <div className="modal-box max-w-xl">
            <h2 className="text-xl font-semibold">Submit task</h2>
            <p className="mt-2 text-sm text-base-content/65">Add your completed work link or a short note for the contest creator.</p>

            <form className="mt-5 space-y-4" onSubmit={handleSubmit(handleTaskSubmit)}>
              <div>
                <label className="label" htmlFor="taskLinkOrText">
                  <span className="label-text">Submission</span>
                </label>
                <textarea
                  id="taskLinkOrText"
                  className="textarea textarea-bordered min-h-32 w-full"
                  placeholder="Paste your public task link or describe where the creator can review your work."
                  {...register('taskLinkOrText', {
                    required: 'Submission is required',
                    minLength: { value: 8, message: 'Submission is too short' },
                    maxLength: { value: 1000, message: 'Submission is too long' },
                  })}
                />
                {errors.taskLinkOrText ? <p className="mt-1 text-sm text-error">{errors.taskLinkOrText.message}</p> : null}
              </div>

              <div className="modal-action">
                <button className="btn btn-ghost" type="button" onClick={() => setSubmissionOpen(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" disabled={submissionMutation.isPending} type="submit">
                  {submissionMutation.isPending ? 'Submitting...' : 'Submit task'}
                </button>
              </div>
            </form>
          </div>
          <button className="modal-backdrop" type="button" onClick={() => setSubmissionOpen(false)}>Close</button>
        </div>
      ) : null}
    </section>
  )
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import DatePicker from 'react-datepicker'
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

  if (contest.status === 'approved') {
    return (
      <ApprovedContestForm
        contest={contest}
        submitting={mutation.isPending}
        onSubmit={(payload) => mutation.mutate(payload)}
      />
    )
  }

  if (contest.status !== 'pending') {
    return <EmptyState title="Contest cannot be edited" message="Rejected contests cannot be changed from this page." action={<Link className="btn btn-primary" to="/dashboard/my-created-contests">Back to contests</Link>} />
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

function ApprovedContestForm({ contest, submitting, onSubmit }) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      deadline: contest?.deadline ? new Date(contest.deadline) : null,
      description: contest?.description || '',
      taskInstruction: contest?.taskInstruction || '',
    },
  })

  const submitForm = (values) => {
    onSubmit({
      deadline: values.deadline?.toISOString(),
      description: values.description,
      taskInstruction: values.taskInstruction,
    })
  }

  return (
    <div className="surface p-5 sm:p-6">
      <h1 className="text-2xl font-semibold">Update Approved Contest</h1>
      <p className="mt-2 text-sm text-base-content/70">
        This contest is already approved, so only the deadline, description, and task instruction can be changed.
      </p>
      <form className="mt-6 grid gap-5 lg:grid-cols-2" onSubmit={handleSubmit(submitForm)}>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Deadline</label>
          <Controller
            control={control}
            name="deadline"
            rules={{ required: 'Deadline is required' }}
            render={({ field }) => (
              <DatePicker
                className="input input-bordered w-full"
                selected={field.value}
                onChange={field.onChange}
                placeholderText="Select deadline"
              />
            )}
          />
          {errors.deadline && <p className="mt-1 text-sm text-error">{errors.deadline.message}</p>}
        </div>

        <div className="lg:col-span-2">
          <label className="mb-1.5 block text-sm font-medium" htmlFor="contest-description">Description</label>
          <textarea
            id="contest-description"
            className="textarea textarea-bordered min-h-28 w-full"
            {...register('description', { required: 'Description is required' })}
          />
          {errors.description && <p className="mt-1 text-sm text-error">{errors.description.message}</p>}
        </div>

        <div className="lg:col-span-2">
          <label className="mb-1.5 block text-sm font-medium" htmlFor="contest-task">Task Instruction</label>
          <textarea
            id="contest-task"
            className="textarea textarea-bordered min-h-28 w-full"
            {...register('taskInstruction', { required: 'Task instruction is required' })}
          />
          {errors.taskInstruction && <p className="mt-1 text-sm text-error">{errors.taskInstruction.message}</p>}
        </div>

        <div className="flex flex-wrap gap-3 lg:col-span-2">
          <button className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
          <Link className="btn btn-outline" to="/dashboard/my-created-contests">Cancel</Link>
        </div>
      </form>
    </div>
  )
}

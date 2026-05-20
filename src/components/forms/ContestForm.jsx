import { Controller, useForm } from 'react-hook-form'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const contestTypes = [
  'Image Design',
  'Article Writing',
  'Online Gaming',
  'Singing',
  'Dancing',
  'UI/UX Design',
  'Logo Design',
  'Photography',
  'Video Editing',
  'Content Creation',
  'Coding Challenge',
]

function buildDefaultValues(contest) {
  return {
    title: contest?.title || '',
    image: contest?.image || '',
    description: contest?.description || '',
    price: contest?.price ?? '',
    prizeMoney: contest?.prizeMoney ?? '',
    taskInstruction: contest?.taskInstruction || '',
    type: contest?.type || '',
    deadline: contest?.deadline ? new Date(contest.deadline) : null,
  }
}

export function ContestForm({ contest, submitLabel = 'Submit Contest', submitting = false, onSubmit }) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: buildDefaultValues(contest) })

  const submitForm = (values) => {
    onSubmit({
      ...values,
      price: Number(values.price),
      prizeMoney: Number(values.prizeMoney),
      deadline: values.deadline?.toISOString(),
    })
  }

  return (
    <form className="grid gap-5 lg:grid-cols-2" onSubmit={handleSubmit(submitForm)}>
      <div>
        <label className="mb-1.5 block text-sm font-medium" htmlFor="contest-title">Contest Name</label>
        <input id="contest-title" className="input input-bordered w-full" {...register('title', { required: 'Contest name is required' })} />
        {errors.title && <p className="mt-1 text-sm text-error">{errors.title.message}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium" htmlFor="contest-image">Image URL</label>
        <input id="contest-image" className="input input-bordered w-full" {...register('image', { required: 'Image URL is required' })} />
        {errors.image && <p className="mt-1 text-sm text-error">{errors.image.message}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium" htmlFor="contest-price">Entry Price</label>
        <input
          id="contest-price"
          className="input input-bordered w-full"
          type="number"
          min="0"
          step="1"
          {...register('price', { required: 'Price is required', min: { value: 0, message: 'Price cannot be negative' } })}
        />
        {errors.price && <p className="mt-1 text-sm text-error">{errors.price.message}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium" htmlFor="contest-prize">Prize Money</label>
        <input
          id="contest-prize"
          className="input input-bordered w-full"
          type="number"
          min="0"
          step="1"
          {...register('prizeMoney', { required: 'Prize money is required', min: { value: 0, message: 'Prize cannot be negative' } })}
        />
        {errors.prizeMoney && <p className="mt-1 text-sm text-error">{errors.prizeMoney.message}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium" htmlFor="contest-type">Contest Type</label>
        <select id="contest-type" className="select select-bordered w-full" {...register('type', { required: 'Contest type is required' })}>
          <option value="">Select type</option>
          {contestTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        {errors.type && <p className="mt-1 text-sm text-error">{errors.type.message}</p>}
      </div>

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
              minDate={new Date()}
              placeholderText="Select deadline"
            />
          )}
        />
        {errors.deadline && <p className="mt-1 text-sm text-error">{errors.deadline.message}</p>}
      </div>

      <div className="lg:col-span-2">
        <label className="mb-1.5 block text-sm font-medium" htmlFor="contest-description">Description</label>
        <textarea id="contest-description" className="textarea textarea-bordered min-h-28 w-full" {...register('description', { required: 'Description is required' })} />
        {errors.description && <p className="mt-1 text-sm text-error">{errors.description.message}</p>}
      </div>

      <div className="lg:col-span-2">
        <label className="mb-1.5 block text-sm font-medium" htmlFor="contest-task">Task Instruction</label>
        <textarea id="contest-task" className="textarea textarea-bordered min-h-28 w-full" {...register('taskInstruction', { required: 'Task instruction is required' })} />
        {errors.taskInstruction && <p className="mt-1 text-sm text-error">{errors.taskInstruction.message}</p>}
      </div>

      <div className="lg:col-span-2">
        <button className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}

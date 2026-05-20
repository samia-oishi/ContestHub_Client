import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import toast from 'react-hot-toast'
import { getContestDetails } from '../../api/contestApi'
import { confirmRegistration, createPaymentIntent, getRegistrationStatus } from '../../api/paymentApi'
import { EmptyState } from '../../components/shared/EmptyState'
import { LoadingState } from '../../components/shared/LoadingState'
import { formatCurrency, formatDate } from '../../utils/formatters'

const stripePromise = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  : null

function CheckoutForm({ contestId, clientSecret, paymentIntentId }) {
  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const confirmMutation = useMutation({
    mutationFn: confirmRegistration,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['contest-details', contestId] }),
        queryClient.invalidateQueries({ queryKey: ['registration-status', contestId] }),
        queryClient.invalidateQueries({ queryKey: ['my-registrations'] }),
      ])
      toast.success('Registration completed')
      navigate(`/contests/${contestId}`)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Registration could not be confirmed')
    },
  })

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!stripe || !elements || confirmMutation.isPending) return

    const cardElement = elements.getElement(CardElement)

    if (!cardElement) {
      toast.error('Card form is not ready')
      return
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    })

    if (error) {
      toast.error(error.message || 'Payment failed')
      return
    }

    if (paymentIntent?.status !== 'succeeded') {
      toast.error('Payment was not completed')
      return
    }

    confirmMutation.mutate({ contestId, paymentIntentId: paymentIntent.id || paymentIntentId })
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="rounded-lg border border-base-300 bg-base-100 p-4">
        <CardElement
          options={{
            hidePostalCode: true,
            style: {
              base: {
                color: '#1f2937',
                fontSize: '16px',
                '::placeholder': {
                  color: '#64748b',
                },
              },
            },
          }}
        />
      </div>
      <button className="btn btn-primary w-full" disabled={!stripe || confirmMutation.isPending}>
        {confirmMutation.isPending ? 'Confirming...' : 'Pay and register'}
      </button>
      <p className="text-xs text-base-content/60">
        Use Stripe test card 4242 4242 4242 4242 with any future expiry and CVC.
      </p>
    </form>
  )
}

export function Payment() {
  const { contestId } = useParams()
  const [pageLoadedAt] = useState(() => Date.now())

  const contestQuery = useQuery({
    queryKey: ['contest-details', contestId],
    queryFn: () => getContestDetails(contestId),
    enabled: Boolean(contestId),
  })

  const registrationQuery = useQuery({
    queryKey: ['registration-status', contestId],
    queryFn: () => getRegistrationStatus(contestId),
    enabled: Boolean(contestId),
  })

  const ended = contestQuery.data?.deadline
    ? new Date(contestQuery.data.deadline).getTime() <= pageLoadedAt
    : false

  const intentQuery = useQuery({
    queryKey: ['payment-intent', contestId],
    queryFn: () => createPaymentIntent(contestId),
    enabled: Boolean(contestId && contestQuery.data && !registrationQuery.data?.registered && !ended),
    retry: false,
  })

  if (contestQuery.isLoading || registrationQuery.isLoading) {
    return <LoadingState label="Preparing payment..." />
  }

  if (contestQuery.isError || !contestQuery.data) {
    return (
      <section className="page-shell py-10">
        <EmptyState title="Payment unavailable" message="The contest could not be loaded for registration." action={<Link className="btn btn-primary" to="/all-contests">Browse contests</Link>} />
      </section>
    )
  }

  if (!stripePromise) {
    return (
      <section className="page-shell py-10">
        <EmptyState title="Stripe is not configured" message="Add the Stripe publishable key to the client environment file and restart the dev server." />
      </section>
    )
  }

  if (registrationQuery.data?.registered) {
    return (
      <section className="page-shell py-10">
        <EmptyState title="Already registered" message="You have already joined this contest." action={<Link className="btn btn-primary" to={`/contests/${contestId}`}>Back to contest</Link>} />
      </section>
    )
  }

  if (ended) {
    return (
      <section className="page-shell py-10">
        <EmptyState title="Registration closed" message="This contest deadline has already passed." action={<Link className="btn btn-primary" to={`/contests/${contestId}`}>Back to contest</Link>} />
      </section>
    )
  }

  const contest = contestQuery.data

  return (
    <section className="page-shell py-10">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="surface p-6">
          <span className="badge badge-outline">{contest.type}</span>
          <h1 className="mt-3 text-2xl font-semibold">{contest.title}</h1>
          <p className="mt-3 text-base-content/70">{contest.description}</p>
          <div className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-base-content/60">Entry fee</span>
              <span className="font-semibold">{formatCurrency(contest.price || 0)}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-base-content/60">Prize money</span>
              <span className="font-semibold">{formatCurrency(contest.prizeMoney || 0)}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-base-content/60">Deadline</span>
              <span className="font-semibold">{formatDate(contest.deadline)}</span>
            </div>
          </div>
        </div>

        <div className="surface p-6">
          <h2 className="text-xl font-semibold">Secure checkout</h2>
          <p className="mt-2 text-sm text-base-content/65">Your registration is created only after Stripe confirms the payment.</p>
          <div className="mt-6">
            {intentQuery.isLoading && <LoadingState label="Loading checkout..." />}
            {intentQuery.isError && (
              <EmptyState
                title="Checkout could not start"
                message={intentQuery.error?.response?.data?.message || 'Please try again in a moment.'}
                action={<Link className="btn btn-outline" to={`/contests/${contestId}`}>Back to contest</Link>}
              />
            )}
            {intentQuery.data?.clientSecret && (
              <Elements stripe={stripePromise}>
                <CheckoutForm
                  contestId={contestId}
                  clientSecret={intentQuery.data.clientSecret}
                  paymentIntentId={intentQuery.data.paymentIntentId}
                />
              </Elements>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

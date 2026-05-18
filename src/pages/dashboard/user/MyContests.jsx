import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'
import { getMyRegistrations } from '../../../api/paymentApi'
import { EmptyState } from '../../../components/shared/EmptyState'
import { LoadingState } from '../../../components/shared/LoadingState'
import { formatCurrency, formatDate } from '../../../utils/formatters'

export function MyContests() {
  const { data: registrations = [], isLoading, isError } = useQuery({
    queryKey: ['my-registrations'],
    queryFn: getMyRegistrations,
  })

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">My Participated Contests</h1>
        <p className="mt-1 text-sm text-base-content/70">Contests you joined through payment.</p>
      </div>

      {isLoading ? <LoadingState label="Loading participated contests..." /> : null}
      {isError ? <EmptyState title="Could not load contests" message="Please refresh or check your session." /> : null}
      {!isLoading && !isError && registrations.length === 0 ? (
        <EmptyState title="No contests joined yet" message="Registered contests will appear here after payment." action={<Link className="btn btn-primary" to="/all-contests">Browse contests</Link>} />
      ) : null}

      {!isLoading && !isError && registrations.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-base-300 bg-base-100">
          <table className="table">
            <thead>
              <tr>
                <th>Contest</th>
                <th>Type</th>
                <th>Entry</th>
                <th>Registered</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((registration) => (
                <tr key={registration._id}>
                  <td className="font-medium">{registration.contest?.title || registration.contestTitle}</td>
                  <td>{registration.contest?.type || 'Contest'}</td>
                  <td>{formatCurrency(registration.amount || registration.contest?.price || 0)}</td>
                  <td>{formatDate(registration.registeredAt)}</td>
                  <td><span className="badge badge-outline">{registration.isWinner ? 'Winner' : registration.paymentStatus || 'Registered'}</span></td>
                  <td>
                    {registration.contest?._id ? (
                      <Link className="btn btn-outline btn-xs" to={`/contests/${registration.contest._id}`}>Details</Link>
                    ) : null}
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

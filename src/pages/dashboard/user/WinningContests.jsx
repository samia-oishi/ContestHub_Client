import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'
import { getMyWinningRegistrations } from '../../../api/userApi'
import { EmptyState } from '../../../components/shared/EmptyState'
import { LoadingState } from '../../../components/shared/LoadingState'
import { formatCurrency, formatDate } from '../../../utils/formatters'

export function WinningContests() {
  const { data: wins = [], isLoading, isError } = useQuery({
    queryKey: ['my-winning-registrations'],
    queryFn: getMyWinningRegistrations,
  })

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">My Winning Contests</h1>
        <p className="mt-1 text-sm text-base-content/70">Contests where your submission was selected as the winner.</p>
      </div>

      {isLoading ? <LoadingState label="Loading wins..." /> : null}
      {isError ? <EmptyState title="Could not load winning contests" message="Please refresh or check your session." /> : null}
      {!isLoading && !isError && wins.length === 0 ? (
        <EmptyState title="No wins yet" message="Winning contests will appear here after creators declare results." />
      ) : null}

      {!isLoading && !isError && wins.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {wins.map((win) => (
            <article key={win._id} className="surface overflow-hidden">
              <img className="aspect-[16/9] w-full object-cover" src={win.contest?.image || '/favicon.svg'} alt={win.contest?.title || win.contestTitle} />
              <div className="p-5">
                <span className="badge badge-outline">{win.contest?.type || 'Contest'}</span>
                <h2 className="mt-3 text-lg font-semibold">{win.contest?.title || win.contestTitle}</h2>
                <div className="mt-4 space-y-2 text-sm text-base-content/70">
                  <p>Prize: <span className="font-medium text-base-content">{formatCurrency(win.contest?.prizeMoney || 0)}</span></p>
                  <p>Registered: {formatDate(win.registeredAt)}</p>
                </div>
                {win.contest?._id ? (
                  <Link className="btn btn-primary btn-sm mt-5" to={`/contests/${win.contest._id}`}>View contest</Link>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  )
}

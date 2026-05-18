import { useQuery } from '@tanstack/react-query'
import { getRecentWinners } from '../../api/statsApi'
import { EmptyState } from '../../components/shared/EmptyState'
import { LoadingState } from '../../components/shared/LoadingState'
import { formatCurrency } from '../../utils/formatters'

export function SuccessStories() {
  const { data: winners = [], isLoading, isError } = useQuery({
    queryKey: ['success-winners'],
    queryFn: () => getRecentWinners(6),
  })

  return (
    <section className="page-shell py-10">
      <div className="mb-6">
        <p className="text-sm font-medium text-primary">Recent results</p>
        <h1 className="mt-2 text-3xl font-semibold">Success Stories</h1>
        <p className="mt-2 max-w-2xl text-base-content/70">A simple record of contest winners and the work recognized by creators.</p>
      </div>

      {isLoading ? <LoadingState label="Loading winner stories..." /> : null}
      {isError ? <EmptyState title="Could not load stories" message="Please refresh or check the server connection." /> : null}
      {!isLoading && !isError && winners.length === 0 ? (
        <EmptyState title="No stories yet" message="Winner stories will appear after creators declare contest results." />
      ) : null}
      {!isLoading && !isError && winners.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {winners.map((winner) => (
            <article key={winner._id} className="surface overflow-hidden">
              <img className="aspect-[16/9] w-full object-cover" src={winner.contestImage || '/favicon.svg'} alt={winner.contestTitle} />
              <div className="p-5">
                <span className="badge badge-outline">{winner.contestType}</span>
                <h2 className="mt-3 text-lg font-semibold">{winner.contestTitle}</h2>
                <div className="mt-4 flex items-center gap-3">
                  <img className="h-11 w-11 rounded-full object-cover" src={winner.winnerPhoto || '/favicon.svg'} alt={winner.winnerName} />
                  <div>
                    <p className="font-medium">{winner.winnerName}</p>
                    <p className="text-sm text-base-content/60">{formatCurrency(winner.prizeMoney)} prize</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  )
}

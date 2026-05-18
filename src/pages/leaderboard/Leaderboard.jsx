import { Trophy } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getLeaderboard } from '../../api/statsApi'
import { EmptyState } from '../../components/shared/EmptyState'
import { LoadingState } from '../../components/shared/LoadingState'

export function Leaderboard() {
  const { data: leaders = [], isLoading, isError } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => getLeaderboard(20),
  })

  return (
    <section className="page-shell py-10">
      <div className="mb-6">
        <p className="text-sm font-medium text-primary">Top performers</p>
        <h1 className="mt-2 text-3xl font-semibold">Leaderboard</h1>
        <p className="mt-2 max-w-2xl text-base-content/70">Users ranked by declared contest wins.</p>
      </div>

      {isLoading ? <LoadingState label="Loading leaderboard..." /> : null}
      {isError ? <EmptyState title="Could not load leaderboard" message="Please refresh or check the server connection." /> : null}
      {!isLoading && !isError && leaders.length === 0 ? (
        <EmptyState title="No winners yet" message="The leaderboard will update after creators declare contest winners." />
      ) : null}

      {!isLoading && !isError && leaders.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-base-300 bg-base-100">
          <table className="table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Participant</th>
                <th>Role</th>
                <th className="text-right">Wins</th>
              </tr>
            </thead>
            <tbody>
              {leaders.map((leader) => (
                <tr key={leader._id}>
                  <td>
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-base-300 text-sm font-semibold">
                      {leader.rank}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <img className="h-11 w-11 rounded-full object-cover" src={leader.photoURL || '/favicon.svg'} alt={leader.name} />
                      <div>
                        <p className="font-medium">{leader.name}</p>
                        <p className="text-sm text-base-content/60">{leader.email}</p>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-outline capitalize">{leader.role}</span></td>
                  <td className="text-right">
                    <span className="inline-flex items-center gap-2 font-semibold">
                      <Trophy size={16} />
                      {leader.winCount}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  )
}

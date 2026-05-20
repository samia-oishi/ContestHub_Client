import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'
import { ArrowRight, CreditCard, FileCheck2, Search, Trophy } from 'lucide-react'
import { getPopularContests } from '../../api/contestApi'
import { getRecentWinners } from '../../api/statsApi'
import { ContestCard } from '../../components/contest/ContestCard'
import { EmptyState } from '../../components/shared/EmptyState'
import { LoadingState } from '../../components/shared/LoadingState'
import { formatCurrency } from '../../utils/formatters'
import contestWinnerImage from '../../assets/contest-winner.png'

const contestTypes = [
  ['Image Design', 'Visual contests for creative artwork and brand assets.'],
  ['Article Writing', 'Writing tasks for research, stories, and useful guides.'],
  ['Online Gaming', 'Join competitive gaming events and skill-based matches.'],
  ['Singing', 'Share vocal performances and compete in music challenges.'],
  ['Coding Challenge', 'Solve practical problems with clean and working code.'],
  ['Dancing', 'Compete with dance performances, routines, and creative moves.'],
]

const steps = [
  ['Browse', 'Find approved contests by type and check the full task details.', Search],
  ['Register', 'Pay the entry fee through a secure Stripe card checkout.', CreditCard],
  ['Submit', 'Send your task before the deadline and wait for the creator review.', FileCheck2],
]

export function Home() {
  const {
    data: contests = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['popular-contests'],
    queryFn: getPopularContests,
  })
  const { data: winners = [] } = useQuery({
    queryKey: ['recent-winners'],
    queryFn: () => getRecentWinners(3),
  })

  return (
    <>
      <section className="hero-frame">
        <div className="page-shell hero-panel">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-center">
            <div className="space-y-6">
              <div>
                <p className="inline-flex rounded-full border border-base-300 bg-base-100/70 px-3 py-1 text-sm font-medium text-primary">
                  Contests for participants and creators
                </p>
                <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight text-base-content sm:text-5xl">
                  Join contests, submit work, and manage winners in one place.
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-base-content/75">
                  Participants can compete in approved contests. Creators can publish tasks, review submissions, and declare winners after the deadline.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link className="btn-brand" to="/all-contests">
                  Browse as participant
                  <ArrowRight size={17} />
                </Link>
                <Link className="btn-soft" to="/register">
                  Start as creator
                </Link>
              </div>
            </div>

            <div className="hero-visual">
              <div className="relative flex min-h-[390px] items-center justify-center">
                <img
                  className="max-h-[430px] w-full object-contain"
                  src={contestWinnerImage}
                  alt="Contest winner holding a trophy and medal"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell py-12">
        <div className="mb-6">
          <p className="text-sm font-medium text-primary">Featured contest types</p>
          <h2 className="text-2xl font-semibold">Choose a category and start exploring</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {contestTypes.map(([title, description]) => (
            <Link
              key={title}
              to={`/all-contests?type=${encodeURIComponent(title)}`}
              className="category-card-blue"
            >
              <h3 className="text-lg font-semibold text-base-content">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-base-content/70">{description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="page-shell py-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-primary">Popular contests</p>
            <h2 className="text-2xl font-semibold">Most active right now</h2>
          </div>
          <Link to="/all-contests" className="btn btn-outline btn-sm">
            Show All
          </Link>
        </div>

        {isLoading ? <LoadingState label="Loading popular contests..." /> : null}
        {isError ? <EmptyState title="Could not load contests" message="Please try again after checking the server connection." /> : null}
        {!isLoading && !isError && contests.length === 0 ? (
          <EmptyState title="No approved contests yet" message="Approved contests will appear here after creators submit them and admins approve them." />
        ) : null}
        {!isLoading && !isError && contests.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-6">
            {contests.map((contest, index) => {
              const shouldCenterLastPair = contests.length % 3 === 2 && index === contests.length - 2

              return (
              <div key={contest._id} className={`w-full xl:col-span-2 ${shouldCenterLastPair ? 'xl:col-start-2' : ''}`}>
                <ContestCard contest={contest} />
              </div>
              )
            })}
          </div>
        ) : null}
      </section>

      <section className="section-muted">
        <div className="page-shell py-12">
          <div className="mb-6">
            <p className="text-sm font-medium text-primary">Simple process</p>
            <h2 className="text-2xl font-semibold">How participation works</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {steps.map(([title, description, Icon], index) => (
              <div key={title} className="rounded-lg border border-base-300 bg-base-100 p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-content">
                    <Icon size={18} />
                  </span>
                  <span className="text-sm font-medium text-base-content/50">Step {index + 1}</span>
                </div>
                <h3 className="mt-4 text-xl font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-base-content/70">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell py-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-primary">Recent winners</p>
            <h2 className="text-2xl font-semibold">Results from completed contests</h2>
          </div>
          <Link to="/leaderboard" className="btn btn-outline btn-sm">
            Leaderboard
          </Link>
        </div>

        {winners.length === 0 ? (
          <EmptyState title="No winners declared yet" message="Recent winners will appear here after creators declare contest results." />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {winners.map((winner) => (
              <article key={winner._id} className="surface overflow-hidden">
                <img className="aspect-[16/9] w-full object-cover" src={winner.contestImage || '/favicon.svg'} alt={winner.contestTitle} />
                <div className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="badge badge-outline">{winner.contestType}</span>
                    <span className="flex items-center gap-1 text-sm font-medium text-accent">
                      <Trophy size={16} />
                      {formatCurrency(winner.prizeMoney)}
                    </span>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold">{winner.contestTitle}</h3>
                  <div className="mt-4 flex items-center gap-3">
                    <img className="h-11 w-11 rounded-full object-cover" src={winner.winnerPhoto || '/favicon.svg'} alt={winner.winnerName} />
                    <div>
                      <p className="font-medium">{winner.winnerName}</p>
                      <p className="text-sm text-base-content/60">Winner</p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  )
}

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router'
import { Search } from 'lucide-react'
import { getPopularContests } from '../../api/contestApi'
import { ContestCard } from '../../components/contest/ContestCard'
import { EmptyState } from '../../components/shared/EmptyState'
import { LoadingState } from '../../components/shared/LoadingState'

export function Home() {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const {
    data: contests = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['popular-contests'],
    queryFn: getPopularContests,
  })

  const handleSearch = (event) => {
    event.preventDefault()
    const value = search.trim()
    navigate(value ? `/all-contests?search=${encodeURIComponent(value)}` : '/all-contests')
  }

  return (
    <>
      <section className="bg-base-200">
        <div className="page-shell grid gap-8 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-6">
            <p className="font-medium text-primary">Discover, compete, and celebrate creative work</p>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">Find practical contests built for real talent.</h1>
            <form className="join w-full max-w-xl" onSubmit={handleSearch}>
              <input
                className="input join-item input-bordered w-full"
                placeholder="Search by contest type"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <button className="btn btn-primary join-item">
                <Search size={18} />
                Search
              </button>
            </form>
          </div>
          <div className="surface p-6">
            <p className="text-sm text-base-content/70">Winner advertisement</p>
            <h2 className="mt-2 text-2xl font-semibold">Celebrate the work that wins clients, prizes, and public recognition.</h2>
            <p className="mt-3 text-sm text-base-content/70">
              Winners will appear here dynamically after creators declare results in upcoming phases.
            </p>
          </div>
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
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {contests.map((contest) => (
              <ContestCard key={contest._id} contest={contest} />
            ))}
          </div>
        ) : null}
      </section>

      <section className="border-y border-base-300 bg-base-200">
        <div className="page-shell grid gap-6 py-12 md:grid-cols-3">
          <div>
            <h2 className="text-xl font-semibold">Browse with intent</h2>
            <p className="mt-2 text-sm text-base-content/70">Filter by contest type and open details before joining.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Register securely</h2>
            <p className="mt-2 text-sm text-base-content/70">Payment-backed participation will be connected in the Stripe phase.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Track your results</h2>
            <p className="mt-2 text-sm text-base-content/70">Your dashboard will keep entries, submissions, and wins organized.</p>
          </div>
        </div>
      </section>
    </>
  )
}

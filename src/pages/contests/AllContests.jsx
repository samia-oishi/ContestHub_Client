import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router'
import { getApprovedContests, getContestTypes } from '../../api/contestApi'
import { ContestCard } from '../../components/contest/ContestCard'
import { EmptyState } from '../../components/shared/EmptyState'
import { LoadingState } from '../../components/shared/LoadingState'

export function AllContests() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeType = searchParams.get('type') || 'All'
  const search = searchParams.get('search') || ''
  const page = Number(searchParams.get('page') || 1)

  const { data: types = [] } = useQuery({
    queryKey: ['contest-types'],
    queryFn: getContestTypes,
  })

  const { data, isLoading, isError } = useQuery({
    queryKey: ['approved-contests', activeType, search, page],
    queryFn: () =>
      getApprovedContests({
        type: activeType === 'All' ? undefined : activeType,
        search: search || undefined,
        page,
        limit: 9,
      }),
  })

  const contests = data?.items || []
  const totalPages = data?.totalPages || 0

  const updateFilter = (type) => {
    const next = new URLSearchParams(searchParams)
    next.delete('search')
    next.delete('page')
    if (type === 'All') next.delete('type')
    else next.set('type', type)
    setSearchParams(next)
  }

  const setPage = (nextPage) => {
    const next = new URLSearchParams(searchParams)
    next.set('page', String(nextPage))
    setSearchParams(next)
  }

  return (
    <section className="page-shell py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">All Contests</h1>
        <p className="mt-2 text-base-content/70">Explore admin-approved contests by type.</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {['All', ...types].map((type) => (
          <button
            key={type}
            className={`btn btn-sm ${activeType === type && !search ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => updateFilter(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {search ? (
        <div className="mb-5 rounded-lg border border-base-300 bg-base-200 p-4 text-sm">
          Showing contest types matching <span className="font-semibold">{search}</span>
        </div>
      ) : null}

      {isLoading ? <LoadingState label="Loading contests..." /> : null}
      {isError ? <EmptyState title="Could not load contests" message="Please try again after checking the server connection." /> : null}
      {!isLoading && !isError && contests.length === 0 ? (
        <EmptyState title="No contests found" message="Approved contests matching this view will appear here." />
      ) : null}
      {!isLoading && !isError && contests.length > 0 ? (
        <>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {contests.map((contest) => (
              <ContestCard key={contest._id} contest={contest} />
            ))}
          </div>
          {totalPages > 1 ? (
            <div className="mt-8 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((item) => (
                <button key={item} className={`btn btn-sm ${item === page ? 'btn-primary' : 'btn-outline'}`} onClick={() => setPage(item)}>
                  {item}
                </button>
              ))}
            </div>
          ) : null}
        </>
      ) : null}
    </section>
  )
}

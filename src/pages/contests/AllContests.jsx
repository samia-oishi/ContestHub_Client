import { useQuery } from '@tanstack/react-query'
import { useRef } from 'react'
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
  const searchInputRef = useRef(null)

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

  const handleSearch = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const value = String(formData.get('search') || '').trim()
    const next = new URLSearchParams(searchParams)
    next.delete('page')
    next.delete('type')

    if (value) next.set('search', value)
    else next.delete('search')

    setSearchParams(next)
  }

  const clearSearch = () => {
    const next = new URLSearchParams(searchParams)
    next.delete('search')
    next.delete('page')
    if (searchInputRef.current) searchInputRef.current.value = ''
    setSearchParams(next)
  }

  return (
    <section className="page-shell py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">All Contests</h1>
        <p className="mt-2 text-base-content/70">Explore admin-approved contests by type or search by contest category.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr] lg:items-start">
        <aside className="surface p-4 lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold">Categories</h2>
          <p className="mt-1 text-sm text-base-content/60">Choose a contest type.</p>
          <div className="mt-4 grid max-h-[420px] gap-2 overflow-y-auto pr-1 sm:grid-cols-2 lg:max-h-none lg:grid-cols-1 lg:overflow-visible lg:pr-0">
            {['All', ...types].map((type) => (
              <button
                key={type}
                className={`category-filter-btn ${activeType === type && !search ? 'category-filter-btn-active' : ''}`}
                onClick={() => updateFilter(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </aside>

        <div className="min-w-0">
          <form className="mb-5 flex flex-col gap-3 rounded-lg border border-base-300 bg-base-100 p-3 shadow-sm sm:flex-row" onSubmit={handleSearch}>
            <input
              ref={searchInputRef}
              key={search}
              name="search"
              className="input input-bordered min-w-0 flex-1"
              placeholder="Search contest type, like Singing or Coding Challenge"
              defaultValue={search}
            />
            <div className="flex gap-2">
              <button className="btn btn-primary flex-1 sm:flex-none">Search</button>
              {search ? (
                <button className="btn btn-outline flex-1 sm:flex-none" type="button" onClick={clearSearch}>
                  Clear
                </button>
              ) : null}
            </div>
          </form>

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
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
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
        </div>
      </div>
    </section>
  )
}

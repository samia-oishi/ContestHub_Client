import { Link } from 'react-router'
import { formatCurrency, formatDate } from '../../utils/formatters'

export function ContestCard({ contest }) {
  return (
    <article className="surface flex h-full min-h-[350px] flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="h-44 shrink-0 border-b border-base-300 bg-base-200">
        <img className="h-full w-full object-cover" src={contest?.image || '/favicon.svg'} alt={contest?.title || 'Contest'} />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="grid min-h-[100px] grid-rows-[24px_56px] gap-2">
          <span className="inline-flex h-6 w-fit max-w-full items-center rounded border border-primary/20 bg-primary/10 px-2 text-[11px] font-semibold uppercase tracking-wide text-primary">
            <span className="truncate">{contest?.type || 'Creative'}</span>
          </span>
          <h3 className="line-clamp-2 text-xl font-semibold leading-7">{contest?.title || 'Contest title'}</h3>
        </div>
        <div className="mt-3 grid gap-2 text-sm text-base-content/70">
          <div className="flex items-center justify-between gap-3">
            <span className="font-semibold text-success">{formatCurrency(contest?.prizeMoney || 0)} prize</span>
          </div>
          <span>Deadline: {formatDate(contest?.deadline)}</span>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 pt-4 text-sm">
          <span className="font-medium">{formatCurrency(contest?.price || 0)} entry</span>
          <Link to={`/contests/${contest?._id || 'preview'}`} className="btn btn-primary btn-sm">
            Details
          </Link>
        </div>
      </div>
    </article>
  )
}

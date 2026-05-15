import { Link } from 'react-router'
import { formatCurrency, formatDate, truncateText } from '../../utils/formatters'

export function ContestCard({ contest }) {
  return (
    <article className="surface overflow-hidden">
      <div className="aspect-[16/10] bg-base-200">
        <img className="h-full w-full object-cover" src={contest?.image || '/favicon.svg'} alt={contest?.title || 'Contest'} />
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-semibold">{contest?.title || 'Contest title'}</h3>
          <span className="badge badge-outline">{contest?.type || 'Creative'}</span>
        </div>
        <p className="min-h-12 text-sm text-base-content/70">
          {truncateText(contest?.description || 'Contest details will appear here after the API is connected.')}
        </p>
        <div className="grid gap-2 text-sm text-base-content/70 sm:grid-cols-2">
          <span>{contest?.participantCount || 0} participants</span>
          <span>{formatCurrency(contest?.prizeMoney || 0)} prize</span>
          <span className="sm:col-span-2">Deadline: {formatDate(contest?.deadline)}</span>
        </div>
        <div className="flex items-center justify-between pt-1 text-sm">
          <span className="font-medium">{formatCurrency(contest?.price || 0)} entry</span>
          <Link to={`/contests/${contest?._id || 'preview'}`} className="btn btn-primary btn-sm">
            Details
          </Link>
        </div>
      </div>
    </article>
  )
}

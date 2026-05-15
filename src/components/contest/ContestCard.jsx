import { Link } from 'react-router'

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
        <p className="text-sm text-base-content/70">
          {contest?.description || 'Contest details will appear here after the API is connected.'}
        </p>
        <div className="flex items-center justify-between text-sm">
          <span>{contest?.participantCount || 0} participants</span>
          <Link to={`/contests/${contest?._id || 'preview'}`} className="btn btn-primary btn-sm">
            Details
          </Link>
        </div>
      </div>
    </article>
  )
}

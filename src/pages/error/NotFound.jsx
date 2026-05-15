import { Link } from 'react-router'

export function NotFound() {
  return (
    <section className="page-shell flex min-h-[70vh] items-center justify-center py-10">
      <div className="surface max-w-lg p-8 text-center">
        <p className="text-sm font-medium text-primary">404</p>
        <h1 className="mt-2 text-3xl font-semibold">Page not found</h1>
        <p className="mt-3 text-base-content/70">The page you are looking for is unavailable.</p>
        <Link to="/" className="btn btn-primary mt-6">
          Back to Home
        </Link>
      </div>
    </section>
  )
}

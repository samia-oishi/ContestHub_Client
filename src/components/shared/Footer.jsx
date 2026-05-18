import { Link } from 'react-router'

export function Footer() {
  return (
    <footer className="border-t border-base-300 bg-base-100 text-base-content">
      <div className="page-shell grid gap-8 py-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <h2 className="text-xl font-semibold text-primary">ContestHub</h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-base-content/65">
            A contest management platform for participants, contest creators, and admins.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">Explore</h3>
          <div className="mt-3 grid gap-2 text-sm text-base-content/65">
            <Link className="hover:text-primary" to="/all-contests">All Contests</Link>
            <Link className="hover:text-primary" to="/leaderboard">Leaderboard</Link>
            <Link className="hover:text-primary" to="/success-stories">Success Stories</Link>
          </div>
        </div>

        <div>
          <h3 className="font-semibold">Account</h3>
          <div className="mt-3 grid gap-2 text-sm text-base-content/65">
            <Link className="hover:text-primary" to="/login">Login</Link>
            <Link className="hover:text-primary" to="/register">Register</Link>
            <Link className="hover:text-primary" to="/dashboard">Dashboard</Link>
          </div>
        </div>
      </div>

      <div className="border-t border-base-300 bg-base-200">
        <div className="page-shell flex flex-col gap-2 py-5 text-sm text-base-content/60 sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright © 2026 ContestHub</p>
          <p>MERN stack assignment project</p>
        </div>
      </div>
    </footer>
  )
}

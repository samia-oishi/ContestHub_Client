export function Footer() {
  return (
    <footer className="border-t border-base-300 bg-base-100">
      <div className="page-shell flex flex-col gap-3 py-8 text-sm text-base-content/70 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold text-base-content">ContestHub</p>
        <p>Copyright © 2025 ContestHub</p>
        <div className="flex gap-4">
          <a href="https://facebook.com" target="_blank" rel="noreferrer">
            Facebook
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  )
}

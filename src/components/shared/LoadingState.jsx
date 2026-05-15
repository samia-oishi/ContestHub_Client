export function LoadingState({ label = 'Loading...' }) {
  return (
    <div className="flex min-h-48 items-center justify-center">
      <span className="loading loading-spinner loading-md text-primary" />
      <span className="ml-3 text-sm text-base-content/70">{label}</span>
    </div>
  )
}

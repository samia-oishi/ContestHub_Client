export function EmptyState({ title, message, action }) {
  return (
    <div className="surface flex min-h-52 flex-col items-center justify-center p-8 text-center">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-base-content/70">{message}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}

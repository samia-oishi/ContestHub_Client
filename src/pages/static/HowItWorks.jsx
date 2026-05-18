export function HowItWorks() {
  const steps = [
    ['Browse contests', 'Filter approved contests by type, compare entry fees, deadlines, prize money, and participant counts before joining.'],
    ['Register securely', 'Use Stripe test checkout to register for a contest. Registration is saved only after payment is verified.'],
    ['Submit your task', 'After registration, submit a project link or written response from the contest details page before the deadline.'],
    ['Track results', 'Creators review submissions after the deadline, declare a winner, and user dashboards update automatically.'],
  ]

  return (
    <section className="page-shell py-10">
      <div className="mb-8">
        <p className="text-sm font-medium text-primary">Contest flow</p>
        <h1 className="mt-2 text-3xl font-semibold">How It Works</h1>
        <p className="mt-2 max-w-2xl text-base-content/70">
          ContestHub keeps the process simple for participants, creators, and admins.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {steps.map(([title, description], index) => (
          <article key={title} className="surface p-5">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-content">
              {index + 1}
            </span>
            <h2 className="mt-4 text-lg font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-base-content/70">{description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

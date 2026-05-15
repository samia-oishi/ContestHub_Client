import { ContestCard } from '../../components/contest/ContestCard'

export function AllContests() {
  return (
    <section className="page-shell py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">All Contests</h1>
        <p className="mt-2 text-base-content/70">Approved contests will load here from the API.</p>
      </div>
      <div className="tabs tabs-boxed mb-6 w-fit">
        <button className="tab tab-active">All</button>
        <button className="tab">Image Design</button>
        <button className="tab">Article Writing</button>
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <ContestCard contest={{ title: 'Contest preview', type: 'Creative', participantCount: 0 }} />
      </div>
    </section>
  )
}

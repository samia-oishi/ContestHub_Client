import { Search } from 'lucide-react'
import { ContestCard } from '../../components/contest/ContestCard'

const previewContests = [
  {
    _id: 'preview-1',
    title: 'Brand Identity Sprint',
    type: 'Image Design',
    participantCount: 42,
    description: 'Design a practical visual identity for a growing local brand.',
  },
  {
    _id: 'preview-2',
    title: 'Founder Story Challenge',
    type: 'Article Writing',
    participantCount: 31,
    description: 'Write a concise article about a founder solving a real customer problem.',
  },
]

export function Home() {
  return (
    <>
      <section className="bg-base-200">
        <div className="page-shell grid gap-8 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-6">
            <p className="font-medium text-primary">Discover, compete, and celebrate creative work</p>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">Find practical contests built for real talent.</h1>
            <div className="join w-full max-w-xl">
              <input className="input join-item input-bordered w-full" placeholder="Search by contest type" />
              <button className="btn btn-primary join-item">
                <Search size={18} />
                Search
              </button>
            </div>
          </div>
          <div className="surface p-6">
            <p className="text-sm text-base-content/70">Recent winners</p>
            <h2 className="mt-2 text-2xl font-semibold">$12,400 awarded across design, writing, and idea contests.</h2>
          </div>
        </div>
      </section>
      <section className="page-shell py-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-primary">Popular contests</p>
            <h2 className="text-2xl font-semibold">Most active right now</h2>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {previewContests.map((contest) => (
            <ContestCard key={contest._id} contest={contest} />
          ))}
        </div>
      </section>
    </>
  )
}

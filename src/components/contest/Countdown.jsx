import { useEffect, useState } from 'react'

function getRemaining(deadline, now) {
  const difference = new Date(deadline).getTime() - now.getTime()

  if (!deadline || difference <= 0) {
    return null
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  }
}

export function Countdown({ deadline }) {
  const [now, setNow] = useState(() => new Date())
  const remaining = getRemaining(deadline, now)

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  if (!remaining) {
    return <span className="badge badge-error badge-lg">Contest Ended</span>
  }

  return (
    <div className="grid grid-cols-4 gap-2 text-center">
      {Object.entries(remaining).map(([label, value]) => (
        <div key={label} className="rounded-lg border border-base-300 bg-base-200 p-3">
          <p className="text-xl font-semibold">{String(value).padStart(2, '0')}</p>
          <p className="text-xs capitalize text-base-content/60">{label}</p>
        </div>
      ))}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  id: string
  title: string
  year: number
  genre: string
  avg: number | null
  total: number
}

export default function MovieCard({ id, title, year, genre, avg, total }: Props) {
  const router = useRouter()
  const [hover, setHover] = useState(0)
  const [loading, setLoading] = useState(false)

  async function rate(score: number) {
    setLoading(true)
    await fetch('/api/ratings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ movieId: id, score }),
    })
    router.refresh()
    setLoading(false)
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col gap-3 hover:border-gray-700 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="font-semibold text-lg leading-tight">{title}</h2>
          <p className="text-gray-500 text-xs mt-0.5">
            {year} · {genre}
          </p>
        </div>
        {avg !== null && (
          <div className="shrink-0 text-right">
            <span className="text-yellow-400 font-bold text-xl">{avg}</span>
            <span className="text-gray-500 text-xs block">{total} voto{total !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            disabled={loading}
            onMouseEnter={() => setHover(s)}
            onClick={() => rate(s)}
            className={`text-2xl transition-transform hover:scale-110 disabled:opacity-50 disabled:cursor-wait ${
              s <= (hover || Math.round(avg ?? 0)) ? 'text-yellow-400' : 'text-gray-700'
            }`}
            aria-label={`Calificar ${s} estrella${s !== 1 ? 's' : ''}`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  )
}

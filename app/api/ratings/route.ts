import { NextResponse } from 'next/server'
import { getRatings, saveRatings } from '../../../lib/s3'

export async function GET() {
  const store = await getRatings()
  return NextResponse.json(store)
}

export async function POST(req: Request) {
  const { movieId, score } = (await req.json()) as { movieId: string; score: number }

  if (!movieId || typeof score !== 'number' || score < 1 || score > 5) {
    return NextResponse.json({ error: 'movieId y score (1-5) son requeridos' }, { status: 400 })
  }

  const store = await getRatings()
  const entry = store[movieId] ?? { movieId, scores: [] }
  entry.scores.push(score)
  store[movieId] = entry
  await saveRatings(store)

  const avg = entry.scores.reduce((a, b) => a + b, 0) / entry.scores.length
  return NextResponse.json({ movieId, avg: Math.round(avg * 10) / 10, total: entry.scores.length })
}

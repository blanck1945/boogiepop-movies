import { getRatings, type RatingsStore } from '../lib/s3'
import MovieCard from './MovieCard'

const MOVIES = [
  { id: 'inception', title: 'Inception', year: 2010, genre: 'Sci-Fi' },
  { id: 'the-godfather', title: 'The Godfather', year: 1972, genre: 'Drama' },
  { id: 'interstellar', title: 'Interstellar', year: 2014, genre: 'Sci-Fi' },
  { id: 'pulp-fiction', title: 'Pulp Fiction', year: 1994, genre: 'Thriller' },
  { id: 'the-dark-knight', title: 'The Dark Knight', year: 2008, genre: 'Action' },
  { id: 'parasite', title: 'Parasite', year: 2019, genre: 'Thriller' },
  { id: 'spirited-away', title: 'Spirited Away', year: 2001, genre: 'Animation' },
  { id: 'the-shawshank-redemption', title: 'The Shawshank Redemption', year: 1994, genre: 'Drama' },
]

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const store: RatingsStore = await getRatings().catch(() => ({} as RatingsStore))
  const bucket = process.env.MOVIE_RATING_S3_BUCKET?.trim() || ''
  const region = process.env.AWS_REGION?.trim() || 'us-east-1'

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">🎬 Movie Rating</h1>
        <p className="text-gray-400 text-sm">Calificá las películas del 1 al 5</p>
      </div>

      <section className="mb-8 rounded-xl border border-gray-800 bg-gray-900/60 p-4 text-sm">
        <h2 className="mb-3 text-base font-semibold">Configuración de entorno</h2>
        <ul className="space-y-2 text-gray-300">
          <li>
            <span className="font-mono text-xs text-gray-200">MOVIE_RATING_S3_BUCKET</span>:{" "}
            {bucket ? (
              <span className="text-emerald-300">{bucket}</span>
            ) : (
              <span className="text-amber-300">No configurado (requerido)</span>
            )}
          </li>
          <li>
            <span className="font-mono text-xs text-gray-200">AWS_REGION</span>:{" "}
            <span className="text-sky-300">{region}</span>
          </li>
        </ul>
        {!bucket ? (
          <p className="mt-3 text-xs text-amber-300">
            Falta <span className="font-mono">MOVIE_RATING_S3_BUCKET</span>. Sin este valor no se
            pueden persistir ratings en S3.
          </p>
        ) : null}
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {MOVIES.map((movie) => {
          const entry = store[movie.id]
          const avg = entry?.scores.length
            ? Math.round((entry.scores.reduce((a, b) => a + b, 0) / entry.scores.length) * 10) / 10
            : null
          return (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              year={movie.year}
              genre={movie.genre}
              avg={avg}
              total={entry?.scores.length ?? 0}
            />
          )
        })}
      </div>
    </main>
  )
}

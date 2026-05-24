import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'

const BUCKET = process.env.MOVIE_RATING_S3_BUCKET ?? ''
const KEY = 'ratings.json'

const s3 = new S3Client({ region: process.env.AWS_REGION ?? 'us-east-1' })

export type Rating = {
  movieId: string
  scores: number[]
}

export type RatingsStore = Record<string, Rating>

export async function getRatings(): Promise<RatingsStore> {
  try {
    const res = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: KEY }))
    const body = await res.Body?.transformToString()
    return body ? (JSON.parse(body) as RatingsStore) : {}
  } catch (err: unknown) {
    if ((err as { name?: string }).name === 'NoSuchKey') return {}
    throw err
  }
}

export async function saveRatings(store: RatingsStore): Promise<void> {
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: KEY,
      Body: JSON.stringify(store),
      ContentType: 'application/json',
    }),
  )
}

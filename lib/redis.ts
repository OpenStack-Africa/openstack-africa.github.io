import { Redis } from '@upstash/redis'

export const redis = Redis.fromEnv()

export const getDownloadKey = (templateId: string) => `downloads:${templateId}`
export const getTotalDownloadsKey = () => `downloads:total`

export async function incrementDownload(templateId: string): Promise<number> {
  const [count] = await Promise.all([
    redis.incr(getDownloadKey(templateId)),
    redis.incr(getTotalDownloadsKey()),
  ])
  return count
}

export async function getDownloadCount(templateId: string): Promise<number> {
  const count = await redis.get<number>(getDownloadKey(templateId))
  return count || 0
}

export async function getAllDownloadCounts(templateIds: string[]): Promise<Record<string, number>> {
  if (templateIds.length === 0) return {}
  const keys = templateIds.map(id => getDownloadKey(id))
  const values = await redis.mget<number[]>(...keys)
  const result: Record<string, number> = {}
  templateIds.forEach((id, i) => {
    result[id] = values[i] || 0
  })
  return result
}

export async function getTotalDownloads(): Promise<number> {
  const total = await redis.get<number>(getTotalDownloadsKey())
  return total || 0
}

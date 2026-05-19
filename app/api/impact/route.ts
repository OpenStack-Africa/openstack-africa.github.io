import { NextResponse } from 'next/server'
import { getAllDownloadCounts, getTotalDownloads } from '@/lib/redis'
import { templates } from '@/data/registry'
import { hoursPerTemplate, DEFAULT_HOURS_SAVED } from '@/data/impact'

export async function GET() {
  try {
    const [counts, total] = await Promise.all([
      getAllDownloadCounts(templates.map(t => t.id)),
      getTotalDownloads(),
    ])

    const hoursSaved = templates.reduce((sum, t) => {
      const downloads = counts[t.id] || 0
      const hours = hoursPerTemplate[t.id] || DEFAULT_HOURS_SAVED
      return sum + (downloads * hours)
    }, 0)

    return NextResponse.json({
      totalDownloads: total,
      totalTemplates: templates.length,
      hoursSaved,
      countries: 5,
      contributors: 7,
    })
  } catch {
    return NextResponse.json({
      totalDownloads: 0,
      totalTemplates: templates.length,
      hoursSaved: 0,
      countries: 5,
      contributors: 7,
    })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { incrementDownload, getAllDownloadCounts, getTotalDownloads } from '@/lib/redis'
import { templates } from '@/data/registry'

export async function POST(request: NextRequest) {
  try {
    const { templateId } = await request.json()
    if (!templateId) return NextResponse.json({ error: 'templateId required' }, { status: 400 })

    const validId = templates.find(t => t.id === templateId)
    if (!validId) return NextResponse.json({ error: 'Invalid templateId' }, { status: 400 })

    const downloads = await incrementDownload(templateId)
    return NextResponse.json({ templateId, downloads })
  } catch (err) {
    console.error('Download tracking error:', err)
    return NextResponse.json({ error: 'Failed to track download' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const templateIds = templates.map(t => t.id)
    const [counts, total] = await Promise.all([
      getAllDownloadCounts(templateIds),
      getTotalDownloads(),
    ])
    return NextResponse.json({ counts, total })
  } catch (err) {
    console.error('Download fetch error:', err)
    return NextResponse.json({ error: 'Failed to fetch counts' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory store for download counts
// In production, replace with Vercel KV or Upstash Redis
const downloadCounts: Record<string, number> = {}

export async function POST(request: NextRequest) {
  try {
    const { templateId } = await request.json()
    if (!templateId) return NextResponse.json({ error: 'templateId required' }, { status: 400 })

    downloadCounts[templateId] = (downloadCounts[templateId] || 0) + 1

    return NextResponse.json({ 
      templateId, 
      downloads: downloadCounts[templateId] 
    })
  } catch {
    return NextResponse.json({ error: 'Failed to track download' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const templateId = searchParams.get('templateId')

  if (templateId) {
    return NextResponse.json({ templateId, downloads: downloadCounts[templateId] || 0 })
  }

  return NextResponse.json({ counts: downloadCounts })
}

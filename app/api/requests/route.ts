import { NextRequest, NextResponse } from 'next/server'
import { redis } from '@/lib/redis'

export interface TemplateRequest {
  id: string
  title: string
  description: string
  apis: string[]
  votes: number
  author: string
  createdAt: string
  status: 'open' | 'in-progress' | 'completed'
}

const REQUESTS_KEY = 'template-requests'

export async function GET() {
  try {
    const raw = await redis.get<string>(REQUESTS_KEY)
    const requests: TemplateRequest[] = raw ? (typeof raw === 'string' ? JSON.parse(raw) : raw) : []
    const sorted = requests.sort((a, b) => b.votes - a.votes)
    return NextResponse.json({ requests: sorted })
  } catch {
    return NextResponse.json({ requests: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, title, description, apis, author, requestId } = body

    const raw = await redis.get<string>(REQUESTS_KEY)
    const requests: TemplateRequest[] = raw ? (typeof raw === 'string' ? JSON.parse(raw) : raw) : []

    if (action === 'create') {
      if (!title || title.trim().length < 10) {
        return NextResponse.json({ error: 'Title must be at least 10 characters' }, { status: 400 })
      }
      const newRequest: TemplateRequest = {
        id: `req-${Date.now()}`,
        title: title.trim(),
        description: description?.trim() || '',
        apis: apis || [],
        votes: 1,
        author: author?.trim() || 'Anonymous',
        createdAt: new Date().toISOString(),
        status: 'open',
      }
      requests.push(newRequest)
      await redis.set(REQUESTS_KEY, JSON.stringify(requests))
      return NextResponse.json({ request: newRequest })
    }

    if (action === 'vote') {
      const req = requests.find(r => r.id === requestId)
      if (!req) return NextResponse.json({ error: 'Request not found' }, { status: 404 })
      req.votes += 1
      await redis.set(REQUESTS_KEY, JSON.stringify(requests))
      return NextResponse.json({ votes: req.votes })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (err) {
    console.error('Requests API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

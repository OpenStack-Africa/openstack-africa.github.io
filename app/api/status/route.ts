import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface ApiCheck {
  id: string
  name: string
  url: string
  method: string
  expectedStatus: number
}

const apis: ApiCheck[] = [
  { id: 'paystack', name: 'Paystack', url: 'https://api.paystack.co/bank', method: 'GET', expectedStatus: 200 },
  { id: 'flutterwave', name: 'Flutterwave', url: 'https://api.flutterwave.com/v3/banks/NG', method: 'GET', expectedStatus: 200 },
  { id: 'termii', name: 'Termii', url: 'https://api.ng.termii.com/api/ping', method: 'GET', expectedStatus: 200 },
  { id: 'kuda', name: 'Kuda', url: 'https://kuda.com', method: 'GET', expectedStatus: 200 },
  { id: 'moniepoint', name: 'Moniepoint', url: 'https://moniepoint.com', method: 'GET', expectedStatus: 200 },
  { id: 'mtn-momo', name: 'MTN MoMo', url: 'https://momodeveloper.mtn.com', method: 'GET', expectedStatus: 200 },
  { id: 'anchor', name: 'Anchor', url: 'https://api.getanchor.co', method: 'GET', expectedStatus: 200 },
  { id: 'squad', name: 'Squad by GTCo', url: 'https://sandbox-api-d.squadco.com', method: 'GET', expectedStatus: 200 },
]

async function checkApi(api: ApiCheck): Promise<{ id: string; status: 'operational' | 'degraded' | 'down'; latency: number; checkedAt: string }> {
  const start = Date.now()
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    const response = await fetch(api.url, {
      method: api.method,
      signal: controller.signal,
      headers: { 'User-Agent': 'OpenStack-Africa-StatusChecker/1.0' },
    })
    clearTimeout(timeout)

    const latency = Date.now() - start
    const isUp = response.status < 500

    return {
      id: api.id,
      status: isUp ? (latency > 3000 ? 'degraded' : 'operational') : 'down',
      latency,
      checkedAt: new Date().toISOString(),
    }
  } catch {
    return {
      id: api.id,
      status: 'down',
      latency: Date.now() - start,
      checkedAt: new Date().toISOString(),
    }
  }
}

export async function GET() {
  try {
    const results = await Promise.allSettled(apis.map(api => checkApi(api)))

    const statuses = results.map((result, i) => {
      if (result.status === 'fulfilled') return result.value
      return { id: apis[i].id, status: 'down' as const, latency: 0, checkedAt: new Date().toISOString() }
    })

    const apiData = apis.map(api => {
      const s = statuses.find(s => s.id === api.id)
      return { ...api, ...s }
    })

    return NextResponse.json({ apis: apiData, checkedAt: new Date().toISOString() })
  } catch (err) {
    return NextResponse.json({ error: 'Status check failed' }, { status: 500 })
  }
}

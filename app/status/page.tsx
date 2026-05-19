'use client'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import { RefreshCw, CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react'

interface ApiStatus {
  id: string
  name: string
  url: string
  status: 'operational' | 'degraded' | 'down' | 'checking'
  latency: number
  checkedAt: string
}

const statusConfig = {
  operational: { label: 'Operational', color: '#00c896', bg: 'rgba(0,200,150,0.08)', border: 'rgba(0,200,150,0.2)', icon: <CheckCircle size={14} /> },
  degraded:    { label: 'Degraded',    color: '#f5a623', bg: 'rgba(245,166,35,0.08)', border: 'rgba(245,166,35,0.2)', icon: <AlertTriangle size={14} /> },
  down:        { label: 'Down',        color: '#e84393', bg: 'rgba(232,67,147,0.08)', border: 'rgba(232,67,147,0.2)', icon: <XCircle size={14} /> },
  checking:    { label: 'Checking...', color: '#555',    bg: 'rgba(80,80,80,0.08)',   border: 'rgba(80,80,80,0.2)',  icon: <Clock size={14} /> },
}

export default function StatusPage() {
  const [apis, setApis] = useState<ApiStatus[]>([])
  const [checkedAt, setCheckedAt] = useState('')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchStatus = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)

    try {
      const res = await fetch('/api/status')
      const data = await res.json()
      setApis(data.apis || [])
      setCheckedAt(data.checkedAt)
    } catch {
      // fail silently
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { fetchStatus() }, [])

  const operationalCount = apis.filter(a => a.status === 'operational').length
  const allOperational = operationalCount === apis.length && apis.length > 0
  const hasIssues = apis.some(a => a.status === 'down' || a.status === 'degraded')

  const overallStatus = loading ? 'checking'
    : allOperational ? 'operational'
    : hasIssues ? (apis.some(a => a.status === 'down') ? 'down' : 'degraded')
    : 'checking'

  const overallConfig = statusConfig[overallStatus]

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '60px 2rem 100px' }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(0,200,150,0.08)', border: '1px solid rgba(0,200,150,0.2)',
            borderRadius: 100, padding: '5px 14px', marginBottom: 20,
            fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)',
          }}>
            <span style={{ width: 5, height: 5, background: 'var(--accent)', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
            Live status
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', lineHeight: 1.1, letterSpacing: '-0.03em', color: 'var(--text)', marginBottom: 10 }}>
                African API Status
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.7, maxWidth: 500 }}>
                Real-time uptime monitoring for the APIs African developers rely on. Checks run every time you load this page.
              </p>
            </div>
            <button onClick={() => fetchStatus(true)} disabled={refreshing}
              style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                color: 'var(--text-muted)', padding: '10px 18px', borderRadius: 8,
                cursor: refreshing ? 'wait' : 'pointer', fontSize: 13,
                display: 'flex', alignItems: 'center', gap: 7,
                fontFamily: 'var(--font-body)',
              }}>
              <RefreshCw size={14} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
              {refreshing ? 'Checking...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Overall status banner */}
        <div style={{
          background: overallConfig.bg, border: `1px solid ${overallConfig.border}`,
          borderRadius: 12, padding: '20px 24px', marginBottom: 24,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: overallConfig.color }}>{overallConfig.icon}</span>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>
                {loading ? 'Checking all systems...' : allOperational ? 'All systems operational' : hasIssues ? 'Some systems experiencing issues' : 'Checking systems...'}
              </div>
              {checkedAt && (
                <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  Last checked {new Date(checkedAt).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
              )}
            </div>
          </div>
          {!loading && (
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.3rem', color: overallConfig.color }}>
              {operationalCount}/{apis.length} <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--text-muted)' }}>operational</span>
            </div>
          )}
        </div>

        {/* API list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 48 }}>
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 12, padding: '20px 24px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: '#1a1a1a' }} />
                  <div>
                    <div style={{ width: 100, height: 14, background: '#1a1a1a', borderRadius: 4, marginBottom: 6 }} />
                    <div style={{ width: 160, height: 11, background: '#151515', borderRadius: 4 }} />
                  </div>
                </div>
                <div style={{ width: 80, height: 24, background: '#1a1a1a', borderRadius: 100 }} />
              </div>
            ))
          ) : apis.map(api => {
            const s = statusConfig[api.status] || statusConfig.checking
            return (
              <div key={api.id} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 12, padding: '18px 24px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexWrap: 'wrap', gap: 12,
                transition: 'border-color 0.15s',
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-hover)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>

                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  {/* Status dot */}
                  <div style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: s.bg, border: `1px solid ${s.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: s.color, flexShrink: 0,
                  }}>
                    {s.icon}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, color: 'var(--text)', marginBottom: 3 }}>{api.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>{api.url}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  {/* Latency */}
                  {api.latency > 0 && (
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: api.latency < 1000 ? '#00c896' : api.latency < 3000 ? '#f5a623' : '#e84393' }}>
                        {api.latency}ms
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>latency</div>
                    </div>
                  )}

                  {/* Status badge */}
                  <div style={{
                    background: s.bg, border: `1px solid ${s.border}`,
                    borderRadius: 100, padding: '4px 12px',
                    display: 'flex', alignItems: 'center', gap: 6,
                    fontSize: 12, fontFamily: 'var(--font-mono)', color: s.color,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                    {s.label}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Note */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 12, padding: '20px 24px',
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, color: 'var(--text)', marginBottom: 8 }}>About this page</div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>
            Status checks run live from our servers on each page load. A "degraded" status means the API responded but took longer than 3 seconds. Latency is measured from our servers in Europe — actual latency from Nigeria may differ. This page is maintained by the OpenStack Africa community and is not affiliated with any of the listed API providers.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
    </div>
  )
}

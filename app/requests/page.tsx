'use client'
import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import { ArrowUp, Plus, X, CheckCircle, Clock, Zap } from 'lucide-react'
import type { TemplateRequest } from '@/app/api/requests/route'

const AFRICAN_APIS = ['Paystack', 'Flutterwave', 'Termii', 'Kuda', 'Moniepoint', 'MTN MoMo', 'Anchor', 'Squad', 'Sudo Africa', 'Lenco', 'WhatsApp Business', 'Slack', 'Google Sheets', 'Airtable', 'Telegram']

const statusConfig = {
  open:        { label: 'Open',        color: '#4a90e2', bg: 'rgba(74,144,226,0.08)',  border: 'rgba(74,144,226,0.2)',  icon: <Clock size={11} /> },
  'in-progress': { label: 'In Progress', color: '#f5a623', bg: 'rgba(245,166,35,0.08)',  border: 'rgba(245,166,35,0.2)',  icon: <Zap size={11} /> },
  completed:   { label: 'Completed',   color: '#00c896', bg: 'rgba(0,200,150,0.08)',   border: 'rgba(0,200,150,0.2)',   icon: <CheckCircle size={11} /> },
}

const SEED_REQUESTS: TemplateRequest[] = [
  { id: 'seed-1', title: 'Moniepoint POS to QuickBooks sync', description: 'Automatically sync Moniepoint POS transactions to QuickBooks Online for accounting', apis: ['Moniepoint'], votes: 24, author: 'Tunde F.', createdAt: '2025-01-10T00:00:00Z', status: 'open' },
  { id: 'seed-2', title: 'Kuda bank statement to Google Sheets monthly report', description: 'Pull monthly Kuda transactions and generate a summary report in Google Sheets', apis: ['Kuda', 'Google Sheets'], votes: 19, author: 'Amara I.', createdAt: '2025-01-12T00:00:00Z', status: 'in-progress' },
  { id: 'seed-3', title: 'WhatsApp order confirmation after Paystack payment', description: 'Send a WhatsApp message to the customer automatically after a successful Paystack payment', apis: ['Paystack', 'WhatsApp Business'], votes: 31, author: 'Ngozi K.', createdAt: '2025-01-08T00:00:00Z', status: 'open' },
  { id: 'seed-4', title: 'Squad by GTCo webhook to Slack', description: 'Real-time Slack notifications for Squad payment events', apis: ['Squad'], votes: 14, author: 'Emeka B.', createdAt: '2025-01-14T00:00:00Z', status: 'open' },
  { id: 'seed-5', title: 'Flutterwave failed payment retry workflow', description: 'Automatically retry failed Flutterwave payments after 24 hours with customer notification', apis: ['Flutterwave', 'Termii'], votes: 22, author: 'Moses O.', createdAt: '2025-01-11T00:00:00Z', status: 'open' },
]

export default function RequestsPage() {
  const [requests, setRequests] = useState<TemplateRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [voted, setVoted] = useState<Set<string>>(new Set())
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [filter, setFilter] = useState<'all' | 'open' | 'in-progress' | 'completed'>('all')

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedApis, setSelectedApis] = useState<string[]>([])
  const [author, setAuthor] = useState('')

  useEffect(() => {
    fetch('/api/requests')
      .then(r => r.json())
      .then(data => {
        const fetched = data.requests || []
        // Merge seed requests with real ones, deduplicating by id
        const ids = new Set(fetched.map((r: TemplateRequest) => r.id))
        const merged = [...fetched, ...SEED_REQUESTS.filter(s => !ids.has(s.id))]
        setRequests(merged.sort((a, b) => b.votes - a.votes))
      })
      .catch(() => setRequests(SEED_REQUESTS.sort((a, b) => b.votes - a.votes)))
      .finally(() => setLoading(false))

    // Load voted from localStorage
    try {
      const v = JSON.parse(localStorage.getItem('osa-voted') || '[]')
      setVoted(new Set(v))
    } catch {}
  }, [])

  const handleVote = async (id: string) => {
    if (voted.has(id)) return
    const newVoted = new Set(voted)
    newVoted.add(id)
    setVoted(newVoted)
    localStorage.setItem('osa-voted', JSON.stringify([...newVoted]))

    setRequests(prev => prev.map(r => r.id === id ? { ...r, votes: r.votes + 1 } : r).sort((a, b) => b.votes - a.votes))

    // Only call API for real requests (not seed)
    if (!id.startsWith('seed-')) {
      await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'vote', requestId: id }),
      })
    }
  }

  const handleSubmit = async () => {
    if (title.trim().length < 10) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', title, description, apis: selectedApis, author: author || 'Anonymous' }),
      })
      const data = await res.json()
      if (data.request) {
        setRequests(prev => [data.request, ...prev].sort((a, b) => b.votes - a.votes))
        setSuccess(true)
        setTitle(''); setDescription(''); setSelectedApis([]); setAuthor('')
        setTimeout(() => { setSuccess(false); setShowForm(false) }, 2000)
      }
    } catch {}
    setSubmitting(false)
  }

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter)

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />

      <div style={{ maxWidth: 820, margin: '0 auto', padding: '60px 2rem 100px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,200,150,0.08)', border: '1px solid rgba(0,200,150,0.2)', borderRadius: 100, padding: '5px 14px', marginBottom: 16, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)' }}>
              <span style={{ width: 5, height: 5, background: 'var(--accent)', borderRadius: '50%' }} />
              {requests.length} requests
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', lineHeight: 1.1, letterSpacing: '-0.03em', color: 'var(--text)', marginBottom: 10 }}>
              Template Requests
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.7, maxWidth: 480 }}>
              What workflow do you wish existed? Request it here. The community votes, and we build the most needed templates first.
            </p>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            style={{ background: 'var(--accent)', border: 'none', color: '#000', padding: '12px 20px', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <Plus size={16} /> Request a template
          </button>
        </div>

        {/* Submit form */}
        {showForm && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(0,200,150,0.2)', borderRadius: 14, padding: '28px 28px 24px', marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text)' }}>New template request</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}><X size={18} /></button>
            </div>

            {success ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--accent)', padding: '16px 0' }}>
                <CheckCircle size={18} />
                <span style={{ fontWeight: 600 }}>Request submitted! The community can now vote on it.</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: 6 }}>WHAT DO YOU NEED? *</label>
                  <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Send WhatsApp message when Paystack payment fails"
                    style={{ width: '100%', background: '#0d0d0d', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 14px', fontSize: 14, color: 'var(--text)', fontFamily: 'var(--font-body)', outline: 'none' }}
                    onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                    onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
                  <div style={{ fontSize: 11, color: title.length < 10 ? '#e84393' : 'var(--text-dim)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>{title.length}/10 min characters</div>
                </div>

                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: 6 }}>MORE DETAIL (optional)</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the use case, the trigger, what should happen..."
                    rows={3} style={{ width: '100%', background: '#0d0d0d', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 14px', fontSize: 14, color: 'var(--text)', fontFamily: 'var(--font-body)', outline: 'none', resize: 'vertical' }}
                    onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                    onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
                </div>

                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: 8 }}>APIS INVOLVED</label>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {AFRICAN_APIS.map(api => {
                      const selected = selectedApis.includes(api)
                      return (
                        <button key={api} onClick={() => setSelectedApis(prev => selected ? prev.filter(a => a !== api) : [...prev, api])}
                          style={{ fontSize: 11, fontFamily: 'var(--font-mono)', padding: '4px 10px', borderRadius: 100, border: `1px solid ${selected ? 'rgba(0,200,150,0.4)' : 'var(--border)'}`, background: selected ? 'rgba(0,200,150,0.1)' : 'transparent', color: selected ? 'var(--accent)' : 'var(--text-muted)', cursor: 'pointer' }}>
                          {api}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: 6 }}>YOUR NAME (optional)</label>
                  <input value={author} onChange={e => setAuthor(e.target.value)} placeholder="e.g. Tunde from Lagos"
                    style={{ width: '100%', background: '#0d0d0d', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 14px', fontSize: 14, color: 'var(--text)', fontFamily: 'var(--font-body)', outline: 'none' }}
                    onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                    onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
                </div>

                <button onClick={handleSubmit} disabled={submitting || title.trim().length < 10}
                  style={{ background: submitting || title.trim().length < 10 ? '#1a1a1a' : 'var(--accent)', border: 'none', color: submitting || title.trim().length < 10 ? 'var(--text-dim)' : '#000', padding: '12px 24px', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: submitting || title.trim().length < 10 ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-display)', alignSelf: 'flex-start' }}>
                  {submitting ? 'Submitting...' : 'Submit request'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {(['all', 'open', 'in-progress', 'completed'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: '7px 14px', borderRadius: 100, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-mono)', border: `1px solid ${filter === f ? 'rgba(0,200,150,0.3)' : 'var(--border)'}`, background: filter === f ? 'rgba(0,200,150,0.08)' : 'transparent', color: filter === f ? 'var(--accent)' : 'var(--text-muted)' }}>
              {f === 'all' ? `All (${requests.length})` : f === 'open' ? `Open (${requests.filter(r => r.status === 'open').length})` : f === 'in-progress' ? `In Progress (${requests.filter(r => r.status === 'in-progress').length})` : `Completed (${requests.filter(r => r.status === 'completed').length})`}
            </button>
          ))}
        </div>

        {/* Requests list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 24px', display: 'flex', gap: 16 }}>
                <div style={{ width: 48, height: 56, background: '#1a1a1a', borderRadius: 8, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ width: '60%', height: 14, background: '#1a1a1a', borderRadius: 4, marginBottom: 8 }} />
                  <div style={{ width: '80%', height: 11, background: '#151515', borderRadius: 4 }} />
                </div>
              </div>
            ))
          ) : filtered.map((req, index) => {
            const s = statusConfig[req.status]
            const hasVoted = voted.has(req.id)
            const isTop = index === 0 && filter === 'all'
            return (
              <div key={req.id} style={{ background: isTop ? 'rgba(0,200,150,0.03)' : 'var(--bg-card)', border: `1px solid ${isTop ? 'rgba(0,200,150,0.15)' : 'var(--border)'}`, borderRadius: 12, padding: '18px 20px', display: 'flex', gap: 16, alignItems: 'flex-start', transition: 'border-color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = isTop ? 'rgba(0,200,150,0.25)' : 'var(--border-hover)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = isTop ? 'rgba(0,200,150,0.15)' : 'var(--border)')}>

                {/* Vote button */}
                <button onClick={() => handleVote(req.id)}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '8px 12px', borderRadius: 8, background: hasVoted ? 'rgba(0,200,150,0.1)' : '#151515', border: `1px solid ${hasVoted ? 'rgba(0,200,150,0.3)' : 'var(--border)'}`, cursor: hasVoted ? 'default' : 'pointer', minWidth: 48, flexShrink: 0, transition: 'all 0.15s' }}>
                  <ArrowUp size={14} color={hasVoted ? 'var(--accent)' : 'var(--text-dim)'} />
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, color: hasVoted ? 'var(--accent)' : 'var(--text)', lineHeight: 1 }}>{req.votes}</span>
                </button>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                    {isTop && <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: '#f5a623', background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.2)', padding: '2px 8px', borderRadius: 100 }}>🔥 Most wanted</span>}
                    <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: s.color, background: s.bg, border: `1px solid ${s.border}`, padding: '2px 8px', borderRadius: 100, display: 'flex', alignItems: 'center', gap: 4 }}>{s.icon} {s.label}</span>
                  </div>

                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, color: 'var(--text)', marginBottom: req.description ? 6 : 10, lineHeight: 1.35 }}>{req.title}</div>

                  {req.description && <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 10 }}>{req.description}</p>}

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    {req.apis.map(api => (
                      <span key={api} style={{ fontSize: 10, fontFamily: 'var(--font-mono)', padding: '2px 8px', borderRadius: 4, background: '#181818', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>{api}</span>
                    ))}
                    <span style={{ fontSize: 11, color: 'var(--text-dim)', marginLeft: 'auto' }}>{req.author} · {new Date(req.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

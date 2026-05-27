'use client'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import { CheckCircle, AlertCircle, Plus, User, Lock } from 'lucide-react'

const INPUT_STYLE = {
  width: '100%', background: '#0d0d0d',
  border: '1px solid #1e1e1e', borderRadius: 8,
  padding: '11px 14px', fontSize: 14,
  color: '#efefef', fontFamily: 'var(--font-body)', outline: 'none',
}

const LABEL_STYLE = {
  fontSize: 12, color: '#7a7a7a',
  fontFamily: 'var(--font-mono)',
  display: 'block' as const, marginBottom: 6,
  textTransform: 'uppercase' as const, letterSpacing: '0.05em',
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [authError, setAuthError] = useState('')
  const [activeTab, setActiveTab] = useState<'template' | 'contributor'>('template')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  // Template form
  const [tId, setTId] = useState('')
  const [tTitle, setTTitle] = useState('')
  const [tDescription, setTDescription] = useState('')
  const [tCategory, setTCategory] = useState('')
  const [tDifficulty, setTDifficulty] = useState('')
  const [tApis, setTApis] = useState('')
  const [tTags, setTTags] = useState('')
  const [tAuthorName, setTAuthorName] = useState('')
  const [tAuthorLocation, setTAuthorLocation] = useState('')
  const [tAuthorTwitter, setTAuthorTwitter] = useState('')
  const [tContributorId, setTContributorId] = useState('')
  const [tReadme, setTReadme] = useState('')

  // Contributor form
  const [cId, setCId] = useState('')
  const [cName, setCName] = useState('')
  const [cBio, setCBio] = useState('')
  const [cLocation, setCLocation] = useState('')
  const [cTwitter, setCTwitter] = useState('')

  const handleAuth = () => {
    if (password.trim()) {
      setAuthed(true)
      setAuthError('')
    } else {
      setAuthError('Password required')
    }
  }

  const generateId = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const handleTemplateNameChange = (val: string) => {
    setTTitle(val)
    if (!tId) setTId(generateId(val))
  }

  const handleContributorNameChange = (val: string) => {
    setCName(val)
    if (!cId) setCId(generateId(val))
  }

  const submitTemplate = async () => {
    if (!tId || !tTitle || !tCategory || !tDifficulty || !tAuthorName) {
      setError('Fill in all required fields')
      return
    }
    setSubmitting(true)
    setError('')
    setSuccess('')
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          action: 'add_template',
          template: {
            id: tId,
            title: tTitle,
            description: tDescription,
            category: tCategory,
            difficulty: tDifficulty,
            apis: tApis.split(',').map(a => a.trim()).filter(Boolean),
            tags: tTags.split(',').map(t => t.trim()).filter(Boolean),
            authorName: tAuthorName,
            authorLocation: tAuthorLocation,
            authorTwitter: tAuthorTwitter,
            contributorId: tContributorId,
          },
          readme: tReadme,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      setSuccess(data.message)
      // Clear form
      setTId(''); setTTitle(''); setTDescription(''); setTCategory('')
      setTDifficulty(''); setTApis(''); setTTags(''); setTAuthorName('')
      setTAuthorLocation(''); setTAuthorTwitter(''); setTContributorId(''); setTReadme('')
    } catch {
      setError('Network error — try again')
    } finally {
      setSubmitting(false)
    }
  }

  const submitContributor = async () => {
    if (!cId || !cName || !cBio || !cLocation) {
      setError('Fill in all required fields')
      return
    }
    setSubmitting(true)
    setError('')
    setSuccess('')
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          action: 'add_contributor',
          contributor: { id: cId, name: cName, bio: cBio, location: cLocation, twitter: cTwitter },
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      setSuccess(data.message)
      setCId(''); setCName(''); setCBio(''); setCLocation(''); setCTwitter('')
    } catch {
      setError('Network error — try again')
    } finally {
      setSubmitting(false)
    }
  }

  const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.target.style.borderColor = '#00c896'
  }
  const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.target.style.borderColor = '#1e1e1e'
  }

  // Auth gate
  if (!authed) {
    return (
      <div style={{ minHeight: '100vh' }}>
        <Navbar />
        <div style={{ maxWidth: 400, margin: '120px auto', padding: '0 2rem' }}>
          <div style={{ background: '#101010', border: '1px solid #1e1e1e', borderRadius: 14, padding: '40px 36px', textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(0,200,150,0.1)', border: '1px solid rgba(0,200,150,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Lock size={20} color="#00c896" />
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem', color: '#efefef', marginBottom: 8 }}>Admin Access</h1>
            <p style={{ fontSize: 13, color: '#7a7a7a', marginBottom: 24 }}>Enter your admin password to continue</p>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAuth()}
              placeholder="Admin password"
              style={{ ...INPUT_STYLE, marginBottom: 12, textAlign: 'center' }}
              onFocus={focusStyle} onBlur={blurStyle}
            />
            {authError && <p style={{ fontSize: 12, color: '#e84393', marginBottom: 12 }}>{authError}</p>}
            <button onClick={handleAuth}
              style={{ width: '100%', background: '#00c896', border: 'none', color: '#000', padding: '12px', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font-display)' }}>
              Enter
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 2rem 100px' }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,200,150,0.08)', border: '1px solid rgba(0,200,150,0.2)', borderRadius: 100, padding: '5px 14px', marginBottom: 14, fontFamily: 'var(--font-mono)', fontSize: 11, color: '#00c896' }}>
            ⚙ Admin Dashboard
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', letterSpacing: '-0.03em', color: '#efefef', marginBottom: 8 }}>
            OpenStack Africa Admin
          </h1>
          <p style={{ color: '#7a7a7a', fontSize: '0.95rem' }}>
            Add new templates and contributors after merging PRs. Changes go live automatically after Vercel redeploys (~30s).
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: '#0d0d0d', borderRadius: 10, padding: 4, border: '1px solid #1e1e1e', width: 'fit-content' }}>
          {[{ id: 'template', label: '📦 Add Template' }, { id: 'contributor', label: '👤 Add Contributor' }].map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id as typeof activeTab); setError(''); setSuccess('') }}
              style={{ padding: '9px 20px', borderRadius: 7, border: 'none', background: activeTab === tab.id ? '#00c896' : 'transparent', color: activeTab === tab.id ? '#000' : '#7a7a7a', fontWeight: activeTab === tab.id ? 700 : 400, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-display)', transition: 'all 0.15s' }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Success / Error */}
        {success && (
          <div style={{ background: 'rgba(0,200,150,0.06)', border: '1px solid rgba(0,200,150,0.2)', borderRadius: 10, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <CheckCircle size={16} color="#00c896" />
            <span style={{ fontSize: 14, color: '#00c896' }}>{success} — Vercel will redeploy in ~30 seconds</span>
          </div>
        )}
        {error && (
          <div style={{ background: 'rgba(232,67,147,0.06)', border: '1px solid rgba(232,67,147,0.2)', borderRadius: 10, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <AlertCircle size={16} color="#e84393" />
            <span style={{ fontSize: 14, color: '#e84393' }}>{error}</span>
          </div>
        )}

        {/* ADD TEMPLATE FORM */}
        {activeTab === 'template' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            <div style={{ background: '#101010', border: '1px solid #1e1e1e', borderRadius: 14, padding: '24px 28px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: '#efefef', marginBottom: 20 }}>Template details</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={LABEL_STYLE}>Title *</label>
                    <input value={tTitle} onChange={e => handleTemplateNameChange(e.target.value)} placeholder="Paystack webhook to Slack"
                      style={INPUT_STYLE} onFocus={focusStyle} onBlur={blurStyle} />
                  </div>
                  <div>
                    <label style={LABEL_STYLE}>ID / Slug *</label>
                    <input value={tId} onChange={e => setTId(e.target.value)} placeholder="paystack-webhook-slack"
                      style={INPUT_STYLE} onFocus={focusStyle} onBlur={blurStyle} />
                  </div>
                </div>

                <div>
                  <label style={LABEL_STYLE}>Description *</label>
                  <textarea value={tDescription} onChange={e => setTDescription(e.target.value)} rows={2} placeholder="What this workflow does in 1-2 sentences"
                    style={{ ...INPUT_STYLE, resize: 'vertical' as const }} onFocus={focusStyle} onBlur={blurStyle} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={LABEL_STYLE}>Category *</label>
                    <select value={tCategory} onChange={e => setTCategory(e.target.value)}
                      style={INPUT_STYLE} onFocus={focusStyle} onBlur={blurStyle}>
                      <option value="">Select...</option>
                      <option value="payments">💳 Payments</option>
                      <option value="messaging">📲 Messaging</option>
                      <option value="banking">🏦 Banking</option>
                      <option value="business-ops">🧾 Business Ops</option>
                    </select>
                  </div>
                  <div>
                    <label style={LABEL_STYLE}>Difficulty *</label>
                    <select value={tDifficulty} onChange={e => setTDifficulty(e.target.value)}
                      style={INPUT_STYLE} onFocus={focusStyle} onBlur={blurStyle}>
                      <option value="">Select...</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={LABEL_STYLE}>APIs used (comma separated) *</label>
                    <input value={tApis} onChange={e => setTApis(e.target.value)} placeholder="paystack, slack"
                      style={INPUT_STYLE} onFocus={focusStyle} onBlur={blurStyle} />
                  </div>
                  <div>
                    <label style={LABEL_STYLE}>Tags (comma separated)</label>
                    <input value={tTags} onChange={e => setTTags(e.target.value)} placeholder="webhook, notifications, paystack"
                      style={INPUT_STYLE} onFocus={focusStyle} onBlur={blurStyle} />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: '#101010', border: '1px solid #1e1e1e', borderRadius: 14, padding: '24px 28px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: '#efefef', marginBottom: 20 }}>
                <User size={15} style={{ display: 'inline', marginRight: 8 }} />Author / Contributor
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={LABEL_STYLE}>Author name *</label>
                    <input value={tAuthorName} onChange={e => setTAuthorName(e.target.value)} placeholder="Tunde Fashola"
                      style={INPUT_STYLE} onFocus={focusStyle} onBlur={blurStyle} />
                  </div>
                  <div>
                    <label style={LABEL_STYLE}>Location</label>
                    <input value={tAuthorLocation} onChange={e => setTAuthorLocation(e.target.value)} placeholder="Lagos, Nigeria"
                      style={INPUT_STYLE} onFocus={focusStyle} onBlur={blurStyle} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={LABEL_STYLE}>Twitter handle</label>
                    <input value={tAuthorTwitter} onChange={e => setTAuthorTwitter(e.target.value.replace('@', ''))} placeholder="tunde_handle"
                      style={INPUT_STYLE} onFocus={focusStyle} onBlur={blurStyle} />
                  </div>
                  <div>
                    <label style={LABEL_STYLE}>Contributor ID (if profile exists)</label>
                    <input value={tContributorId} onChange={e => setTContributorId(e.target.value)} placeholder="tunde-fashola"
                      style={INPUT_STYLE} onFocus={focusStyle} onBlur={blurStyle} />
                    <div style={{ fontSize: 11, color: '#3a3a3a', marginTop: 4, fontFamily: 'var(--font-mono)' }}>Must match ID in contributors.ts</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: '#101010', border: '1px solid #1e1e1e', borderRadius: 14, padding: '24px 28px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: '#efefef', marginBottom: 8 }}>README content (optional)</h2>
              <p style={{ fontSize: 12, color: '#7a7a7a', marginBottom: 12 }}>Paste the README.md content from the PR. Leave empty to skip.</p>
              <textarea value={tReadme} onChange={e => setTReadme(e.target.value)} rows={10}
                placeholder="# Template Title&#10;&#10;## What this does&#10;..."
                style={{ ...INPUT_STYLE, resize: 'vertical' as const, fontSize: 12, fontFamily: 'var(--font-mono)', lineHeight: 1.6, color: '#7a7a7a' }}
                onFocus={focusStyle} onBlur={blurStyle} />
            </div>

            <button onClick={submitTemplate} disabled={submitting}
              style={{ background: submitting ? '#1a1a1a' : '#00c896', border: 'none', color: submitting ? '#555' : '#000', padding: '14px 32px', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: submitting ? 'wait' : 'pointer', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: 8, alignSelf: 'flex-start' }}>
              {submitting ? 'Adding template...' : <><Plus size={16} /> Add template to registry</>}
            </button>
          </div>
        )}

        {/* ADD CONTRIBUTOR FORM */}
        {activeTab === 'contributor' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: '#101010', border: '1px solid #1e1e1e', borderRadius: 14, padding: '24px 28px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: '#efefef', marginBottom: 20 }}>Contributor details</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={LABEL_STYLE}>Full name *</label>
                    <input value={cName} onChange={e => handleContributorNameChange(e.target.value)} placeholder="Tunde Fashola"
                      style={INPUT_STYLE} onFocus={focusStyle} onBlur={blurStyle} />
                  </div>
                  <div>
                    <label style={LABEL_STYLE}>ID / Slug *</label>
                    <input value={cId} onChange={e => setCId(e.target.value)} placeholder="tunde-fashola"
                      style={INPUT_STYLE} onFocus={focusStyle} onBlur={blurStyle} />
                    <div style={{ fontSize: 11, color: '#3a3a3a', marginTop: 4, fontFamily: 'var(--font-mono)' }}>Used in: /contributors/tunde-fashola</div>
                  </div>
                </div>

                <div>
                  <label style={LABEL_STYLE}>Bio *</label>
                  <textarea value={cBio} onChange={e => setCBio(e.target.value)} rows={3} placeholder="1-2 sentence bio about the contributor and what they build"
                    style={{ ...INPUT_STYLE, resize: 'vertical' as const }} onFocus={focusStyle} onBlur={blurStyle} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={LABEL_STYLE}>Location *</label>
                    <input value={cLocation} onChange={e => setCLocation(e.target.value)} placeholder="Lagos, Nigeria"
                      style={INPUT_STYLE} onFocus={focusStyle} onBlur={blurStyle} />
                  </div>
                  <div>
                    <label style={LABEL_STYLE}>Twitter handle (optional)</label>
                    <input value={cTwitter} onChange={e => setCTwitter(e.target.value.replace('@', ''))} placeholder="handle_without_at"
                      style={INPUT_STYLE} onFocus={focusStyle} onBlur={blurStyle} />
                  </div>
                </div>

              </div>
            </div>

            <div style={{ background: 'rgba(0,200,150,0.04)', border: '1px solid rgba(0,200,150,0.15)', borderRadius: 10, padding: '14px 18px', fontSize: 13, color: '#7a7a7a', lineHeight: 1.6 }}>
              💡 After adding a contributor, go to <strong style={{ color: '#efefef' }}>Add Template</strong> and enter their contributor ID so their profile links from every template card they submitted.
            </div>

            <button onClick={submitContributor} disabled={submitting}
              style={{ background: submitting ? '#1a1a1a' : '#00c896', border: 'none', color: submitting ? '#555' : '#000', padding: '14px 32px', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: submitting ? 'wait' : 'pointer', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: 8, alignSelf: 'flex-start' }}>
              {submitting ? 'Adding contributor...' : <><User size={16} /> Add contributor</>}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

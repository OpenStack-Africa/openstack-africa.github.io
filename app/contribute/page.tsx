'use client'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import { CheckCircle, Circle, ArrowRight, AlertCircle, ExternalLink, GitFork, Upload } from 'lucide-react'
import Link from 'next/link'

const AFRICAN_APIS = ['Paystack', 'Flutterwave', 'Termii', 'Kuda', 'Moniepoint', 'MTN MoMo', 'Anchor', 'Squad by GTCo', 'Sudo Africa', 'Lenco', 'Bloc', 'WhatsApp Business', 'Slack', 'Google Sheets', 'Airtable', 'Telegram', 'SendGrid', 'HubSpot']

const CHECKLIST = [
  { id: 'build', label: 'Built and tested the workflow in n8n', detail: 'Your workflow must run without errors before submitting' },
  { id: 'credentials', label: 'Replaced all API keys with YOUR_* placeholders', detail: 'e.g. YOUR_PAYSTACK_SECRET_KEY, YOUR_TERMII_API_KEY' },
  { id: 'nodes', label: 'Workflow has at least 3 nodes', detail: 'Single-node workflows are too simple — add proper logic' },
  { id: 'african', label: 'Uses at least one African API', detail: 'Paystack, Flutterwave, Termii, Kuda, Moniepoint, etc.' },
  { id: 'readme', label: 'Written clear setup instructions', detail: 'A stranger should be able to set this up in under 10 minutes' },
  { id: 'personal', label: 'No personal data in the workflow', detail: 'No real phone numbers, emails, or account numbers' },
]

type Step = 'checklist' | 'form' | 'success'

export default function ContributePage() {
  const [step, setStep] = useState<Step>('checklist')
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [prUrl, setPrUrl] = useState('')

  // Form fields
  const [templateName, setTemplateName] = useState('')
  const [slug, setSlug] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [selectedApis, setSelectedApis] = useState<string[]>([])
  const [workflowJson, setWorkflowJson] = useState('')
  const [readmeContent, setReadmeContent] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [authorLocation, setAuthorLocation] = useState('')
  const [authorTwitter, setAuthorTwitter] = useState('')
  const [jsonError, setJsonError] = useState('')

  const allChecked = CHECKLIST.every(c => checked.has(c.id))

  const toggleCheck = (id: string) => {
    const next = new Set(checked)
    next.has(id) ? next.delete(id) : next.add(id)
    setChecked(next)
  }

  const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const handleNameChange = (val: string) => {
    setTemplateName(val)
    setSlug(generateSlug(val))
  }

  const validateJson = (val: string) => {
    setWorkflowJson(val)
    if (!val.trim()) { setJsonError(''); return }
    try {
      const parsed = JSON.parse(val)
      if (!parsed.nodes || !parsed.name) setJsonError('Missing required fields: name, nodes')
      else if (/sk_live|sk_test/.test(val)) setJsonError('Possible real credentials detected — replace with YOUR_* placeholders')
      else setJsonError('')
    } catch {
      setJsonError('Invalid JSON — check for syntax errors')
    }
  }

  const generateReadme = () => {
    if (!templateName || !selectedApis.length) return
    const template = `# ${templateName}

## What this does
<!-- Describe what problem this workflow solves in 1-2 sentences -->

## APIs used
${selectedApis.map(api => `- **${api}** — <!-- what it does in this workflow -->`).join('\n')}

## Prerequisites
- n8n instance (self-hosted or cloud)
${selectedApis.map(api => `- ${api} account with API access`).join('\n')}

## Setup
1. Import \`workflow.json\` into your n8n instance
2. Go to Settings → Credentials and add credentials for: ${selectedApis.join(', ')}
3. Replace all \`YOUR_*\` placeholders with your real values
4. Activate the workflow and test it

## How it works
<!-- Explain each major step or node in the workflow -->

## Example use case
<!-- Describe a real scenario where this would be used -->

## Author
- Name: ${authorName || 'Your Name'}
- Location: ${authorLocation || 'City, Country'}
${authorTwitter ? `- Twitter: @${authorTwitter}` : ''}`
    setReadmeContent(template)
  }

  const handleSubmit = async () => {
    if (!templateName || !category || !workflowJson || !readmeContent || !authorName || !difficulty) {
      setError('Please fill in all required fields')
      return
    }
    if (jsonError) {
      setError('Please fix the workflow JSON errors first')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateName, slug, category, description, apis: selectedApis, difficulty, workflowJson, readmeContent, authorName, authorLocation, authorTwitter }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Submission failed'); return }
      setPrUrl(data.prUrl)
      setStep('success')
    } catch {
      setError('Network error — please try again')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '60px 2rem 100px' }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,200,150,0.08)', border: '1px solid rgba(0,200,150,0.2)', borderRadius: 100, padding: '5px 14px', marginBottom: 18, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)' }}>
            <GitFork size={12} /> Contribute a template
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', lineHeight: 1.1, letterSpacing: '-0.03em', color: 'var(--text)', marginBottom: 12 }}>
            Share what you've built
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.7 }}>
            Submit a workflow template you've built using African APIs. It takes about 10 minutes and your work helps hundreds of other developers.
          </p>
        </div>

        {/* Progress steps */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 40 }}>
          {[{ id: 'checklist', label: '1. Checklist' }, { id: 'form', label: '2. Submit' }, { id: 'success', label: '3. Done' }].map((s, i) => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: step === s.id ? 'var(--accent)' : ((['checklist', 'form', 'success'].indexOf(step) > i) ? 'rgba(0,200,150,0.2)' : '#151515'), border: `1px solid ${step === s.id ? 'var(--accent)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: step === s.id ? '#000' : 'var(--text-muted)', flexShrink: 0 }}>
                  {['checklist', 'form', 'success'].indexOf(step) > i ? <CheckCircle size={14} color="var(--accent)" /> : i + 1}
                </div>
                <span style={{ fontSize: 13, color: step === s.id ? 'var(--text)' : 'var(--text-muted)', fontWeight: step === s.id ? 600 : 400, whiteSpace: 'nowrap' }}>{s.label}</span>
              </div>
              {i < 2 && <div style={{ flex: 1, height: 1, background: 'var(--border)', margin: '0 12px' }} />}
            </div>
          ))}
        </div>

        {/* STEP 1: CHECKLIST */}
        {step === 'checklist' && (
          <div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '28px 28px 24px', marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', marginBottom: 6 }}>Before you submit</h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.6 }}>Check every box to confirm your template is ready. Our GitHub Action will also validate these automatically when your PR is opened.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {CHECKLIST.map(item => {
                  const isChecked = checked.has(item.id)
                  return (
                    <div key={item.id} onClick={() => toggleCheck(item.id)}
                      style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 16px', borderRadius: 10, background: isChecked ? 'rgba(0,200,150,0.04)' : '#0d0d0d', border: `1px solid ${isChecked ? 'rgba(0,200,150,0.2)' : 'var(--border)'}`, cursor: 'pointer', transition: 'all 0.15s' }}>
                      <div style={{ flexShrink: 0, marginTop: 1 }}>
                        {isChecked ? <CheckCircle size={18} color="var(--accent)" /> : <Circle size={18} color="var(--text-dim)" />}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: isChecked ? 'var(--text)' : 'var(--text-muted)', marginBottom: 3 }}>{item.label}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.5 }}>{item.detail}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Quick reference */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 24px', marginBottom: 24 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', marginBottom: 14 }}>Required files</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { file: 'workflow.json', desc: 'Exported from n8n. No real credentials.', color: '#00c896' },
                  { file: 'README.md', desc: 'Setup instructions using our template format.', color: '#f5a623' },
                  { file: 'preview.png', desc: 'Screenshot of the workflow canvas. Min 1200px wide.', color: '#4a90e2' },
                ].map(({ file, desc, color }) => (
                  <div key={file} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color, background: `${color}12`, border: `1px solid ${color}25`, padding: '2px 8px', borderRadius: 4, flexShrink: 0 }}>{file}</code>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button onClick={() => setStep('form')} disabled={!allChecked}
                style={{ background: allChecked ? 'var(--accent)' : '#1a1a1a', border: 'none', color: allChecked ? '#000' : 'var(--text-dim)', padding: '13px 28px', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: allChecked ? 'pointer' : 'not-allowed', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: 8 }}>
                Continue to submission <ArrowRight size={15} />
              </button>
              <a href="https://github.com/OpenStack-Africa/templates/blob/main/Contributing.md" target="_blank" rel="noopener noreferrer"
                style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '13px 20px', borderRadius: 8, fontSize: 14, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                Read full guide <ExternalLink size={13} />
              </a>
            </div>
            {!allChecked && <p style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 10, fontFamily: 'var(--font-mono)' }}>Check all {CHECKLIST.length - checked.size} remaining items to continue</p>}
          </div>
        )}

        {/* STEP 2: FORM */}
        {step === 'form' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Template info */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '24px 28px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', marginBottom: 20 }}>Template details</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: 6 }}>TEMPLATE NAME *</label>
                  <input value={templateName} onChange={e => handleNameChange(e.target.value)} placeholder="e.g. Paystack payment webhook to Slack"
                    style={{ width: '100%', background: '#0d0d0d', border: '1px solid var(--border)', borderRadius: 8, padding: '11px 14px', fontSize: 14, color: 'var(--text)', fontFamily: 'var(--font-body)', outline: 'none' }}
                    onFocus={e => (e.target.style.borderColor = 'var(--accent)')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
                  {slug && <div style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginTop: 4 }}>Slug: {slug}</div>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: 6 }}>CATEGORY *</label>
                    <select value={category} onChange={e => setCategory(e.target.value)}
                      style={{ width: '100%', background: '#0d0d0d', border: '1px solid var(--border)', borderRadius: 8, padding: '11px 14px', fontSize: 14, color: category ? 'var(--text)' : 'var(--text-dim)', fontFamily: 'var(--font-body)', outline: 'none' }}>
                      <option value="">Select category</option>
                      <option value="payments">💳 Payments</option>
                      <option value="messaging">📲 Messaging</option>
                      <option value="banking">🏦 Banking</option>
                      <option value="business-ops">🧾 Business Ops</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: 6 }}>DIFFICULTY *</label>
                    <select value={difficulty} onChange={e => setDifficulty(e.target.value)}
                      style={{ width: '100%', background: '#0d0d0d', border: '1px solid var(--border)', borderRadius: 8, padding: '11px 14px', fontSize: 14, color: difficulty ? 'var(--text)' : 'var(--text-dim)', fontFamily: 'var(--font-body)', outline: 'none' }}>
                      <option value="">Select difficulty</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: 8 }}>APIS USED</label>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {AFRICAN_APIS.map(api => {
                      const sel = selectedApis.includes(api)
                      return (
                        <button key={api} onClick={() => setSelectedApis(prev => sel ? prev.filter(a => a !== api) : [...prev, api])}
                          style={{ fontSize: 11, fontFamily: 'var(--font-mono)', padding: '4px 10px', borderRadius: 100, border: `1px solid ${sel ? 'rgba(0,200,150,0.4)' : 'var(--border)'}`, background: sel ? 'rgba(0,200,150,0.1)' : 'transparent', color: sel ? 'var(--accent)' : 'var(--text-muted)', cursor: 'pointer' }}>
                          {api}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: 6 }}>BRIEF DESCRIPTION</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="What problem does this template solve?" rows={2}
                    style={{ width: '100%', background: '#0d0d0d', border: '1px solid var(--border)', borderRadius: 8, padding: '11px 14px', fontSize: 14, color: 'var(--text)', fontFamily: 'var(--font-body)', outline: 'none', resize: 'vertical' }}
                    onFocus={e => (e.target.style.borderColor = 'var(--accent)')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
                </div>
              </div>
            </div>

            {/* Workflow JSON */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '24px 28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem' }}>Workflow JSON *</h2>
                <a href="https://docs.n8n.io/workflows/export-import/" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  How to export <ExternalLink size={11} />
                </a>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>In n8n: open your workflow → ⋯ menu → Download. Paste the contents here.</p>
              <textarea value={workflowJson} onChange={e => validateJson(e.target.value)} placeholder='{"name": "Your Workflow", "nodes": [...], "connections": {...}}'
                rows={8} style={{ width: '100%', background: '#0d0d0d', border: `1px solid ${jsonError ? '#e84393' : 'var(--border)'}`, borderRadius: 8, padding: '12px 14px', fontSize: 12, color: '#a8d8a8', fontFamily: 'var(--font-mono)', outline: 'none', resize: 'vertical', lineHeight: 1.6 }}
                onFocus={e => (e.target.style.borderColor = jsonError ? '#e84393' : 'var(--accent)')} onBlur={e => (e.target.style.borderColor = jsonError ? '#e84393' : 'var(--border)')} />
              {jsonError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 8, fontSize: 12, color: '#e84393', fontFamily: 'var(--font-mono)' }}>
                  <AlertCircle size={13} /> {jsonError}
                </div>
              )}
              {workflowJson && !jsonError && <div style={{ fontSize: 12, color: 'var(--accent)', marginTop: 6, fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: 6 }}><CheckCircle size={12} /> Valid workflow JSON</div>}
            </div>

            {/* README */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '24px 28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem' }}>README.md *</h2>
                <button onClick={generateReadme} style={{ background: 'rgba(0,200,150,0.08)', border: '1px solid rgba(0,200,150,0.2)', color: 'var(--accent)', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Upload size={12} /> Auto-generate template
                </button>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>Setup instructions for users. Click "Auto-generate" to get a pre-filled template, then fill in the details.</p>
              <textarea value={readmeContent} onChange={e => setReadmeContent(e.target.value)} placeholder="Click 'Auto-generate template' above to get started..."
                rows={12} style={{ width: '100%', background: '#0d0d0d', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 14px', fontSize: 13, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', outline: 'none', resize: 'vertical', lineHeight: 1.7 }}
                onFocus={e => (e.target.style.borderColor = 'var(--accent)')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            </div>

            {/* About you */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '24px 28px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', marginBottom: 20 }}>About you</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: 6 }}>YOUR NAME *</label>
                    <input value={authorName} onChange={e => setAuthorName(e.target.value)} placeholder="Tunde Fashola"
                      style={{ width: '100%', background: '#0d0d0d', border: '1px solid var(--border)', borderRadius: 8, padding: '11px 14px', fontSize: 14, color: 'var(--text)', fontFamily: 'var(--font-body)', outline: 'none' }}
                      onFocus={e => (e.target.style.borderColor = 'var(--accent)')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: 6 }}>LOCATION</label>
                    <input value={authorLocation} onChange={e => setAuthorLocation(e.target.value)} placeholder="Lagos, Nigeria"
                      style={{ width: '100%', background: '#0d0d0d', border: '1px solid var(--border)', borderRadius: 8, padding: '11px 14px', fontSize: 14, color: 'var(--text)', fontFamily: 'var(--font-body)', outline: 'none' }}
                      onFocus={e => (e.target.style.borderColor = 'var(--accent)')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: 6 }}>TWITTER/X HANDLE (optional)</label>
                  <input value={authorTwitter} onChange={e => setAuthorTwitter(e.target.value.replace('@', ''))} placeholder="your_handle (without @)"
                    style={{ width: '100%', background: '#0d0d0d', border: '1px solid var(--border)', borderRadius: 8, padding: '11px 14px', fontSize: 14, color: 'var(--text)', fontFamily: 'var(--font-body)', outline: 'none' }}
                    onFocus={e => (e.target.style.borderColor = 'var(--accent)')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
                </div>
              </div>
            </div>

            {error && (
              <div style={{ background: 'rgba(232,67,147,0.06)', border: '1px solid rgba(232,67,147,0.2)', borderRadius: 10, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <AlertCircle size={16} color="#e84393" />
                <span style={{ fontSize: 14, color: '#e84393' }}>{error}</span>
              </div>
            )}

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setStep('checklist')} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '13px 20px', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontFamily: 'var(--font-body)' }}>← Back</button>
              <button onClick={handleSubmit} disabled={submitting}
                style={{ background: submitting ? '#1a1a1a' : 'var(--accent)', border: 'none', color: submitting ? 'var(--text-dim)' : '#000', padding: '13px 32px', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: submitting ? 'wait' : 'pointer', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: 8 }}>
                {submitting ? 'Opening PR...' : 'Submit template →'}
              </button>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
              This will open a Pull Request on GitHub. A maintainer will review and merge it within 3 business days.
            </p>
          </div>
        )}

        {/* STEP 3: SUCCESS */}
        {step === 'success' && (
          <div style={{ background: 'rgba(0,200,150,0.04)', border: '1px solid rgba(0,200,150,0.2)', borderRadius: 16, padding: '48px 40px', textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(0,200,150,0.12)', border: '2px solid rgba(0,200,150,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <CheckCircle size={28} color="var(--accent)" />
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.8rem', letterSpacing: '-0.02em', color: 'var(--text)', marginBottom: 12 }}>
              Template submitted! 🎉
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 28, maxWidth: 480, margin: '0 auto 28px' }}>
              Your Pull Request is open on GitHub. Our automated validator is running checks right now. A maintainer will review and merge it within 3 business days.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href={prUrl} target="_blank" rel="noopener noreferrer"
                style={{ background: 'var(--accent)', color: '#000', padding: '12px 24px', borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none', fontFamily: 'var(--font-display)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                View your PR <ExternalLink size={14} />
              </a>
              <Link href="/" style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '12px 20px', borderRadius: 8, fontSize: 14, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                Back to templates
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

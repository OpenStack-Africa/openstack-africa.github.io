'use client'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import { ArrowRight, Download, Copy, CheckCircle, Sparkles, AlertCircle } from 'lucide-react'

const AFRICAN_APIS = [
  'Paystack', 'Flutterwave', 'Termii', 'Kuda', 'Moniepoint',
  'MTN MoMo', 'Anchor', 'Squad by GTCo', 'Sudo Africa', 'Lenco',
  'Bloc', 'Providus', 'WhatsApp Business', 'Slack', 'Google Sheets',
  'Airtable', 'Telegram', 'SendGrid', 'Notion', 'HubSpot',
]

const EXAMPLES = [
  'Send a Slack notification when a Paystack payment fails',
  'Create a virtual account via Anchor when a new user signs up',
  'Send OTP via Termii and verify it before allowing checkout',
  'Reconcile Flutterwave transactions into Google Sheets every morning',
  'Notify the team on Telegram when a Moniepoint POS transaction happens',
  'Send a WhatsApp message when a Kuda account balance drops low',
]

export default function GeneratePage() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ workflow: string; explanation: string } | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [step, setStep] = useState('')

  const generate = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    setResult(null)
    setError('')
    setCopied(false)

    const steps = [
      'Understanding your workflow...',
      'Designing the node structure...',
      'Building API connections...',
      'Generating workflow JSON...',
      'Almost ready...',
    ]
    let stepIndex = 0
    setStep(steps[0])
    const stepInterval = setInterval(() => {
      stepIndex = Math.min(stepIndex + 1, steps.length - 1)
      setStep(steps[stepIndex])
    }, 1800)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      clearInterval(stepInterval)

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'API error')
      }

      const data = await response.json()
      setResult({
        workflow: data.workflow,
        explanation: data.explanation,
      })
    } catch (err: unknown) {
      clearInterval(stepInterval)
      const message = err instanceof Error ? err.message : 'Unknown error'
      if (message.includes('401') || message.includes('403')) {
        setError('Authentication error. Please try again in a moment.')
      } else if (message.includes('429')) {
        setError('Too many requests. Please wait a moment and try again.')
      } else {
        setError('Something went wrong generating the workflow. Please try again.')
      }
    } finally {
      setLoading(false)
      setStep('')
    }
  }

  const handleDownload = () => {
    if (!result) return
    const blob = new Blob([result.workflow], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `generated-workflow-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleCopy = () => {
    if (!result) return
    navigator.clipboard.writeText(result.workflow)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '60px 2rem 100px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(0,200,150,0.08)', border: '1px solid rgba(0,200,150,0.2)',
            borderRadius: 100, padding: '6px 16px', marginBottom: 24,
            fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)',
          }}>
            <Sparkles size={13} />
            Powered by Claude AI
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            lineHeight: 1.08, letterSpacing: '-0.04em',
            color: 'var(--text)', marginBottom: 16,
          }}>
            Describe your workflow.<br />
            <span style={{ color: 'var(--accent)' }}>We'll build it.</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: 520, margin: '0 auto' }}>
            Tell us what you want to automate using African APIs. Claude will generate a ready-to-import n8n workflow JSON in seconds.
          </p>
        </div>

        {/* Input */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 16, padding: '28px 28px 24px', marginBottom: 20,
        }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: 12, fontFamily: 'var(--font-display)' }}>
            What do you want to automate?
          </label>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="e.g. Send a Slack notification when a Paystack payment fails, including the customer email and amount"
            rows={4}
            style={{
              width: '100%', background: '#0d0d0d',
              border: '1px solid var(--border)', borderRadius: 10,
              padding: '14px 16px', fontSize: 14,
              color: 'var(--text)', fontFamily: 'var(--font-body)',
              outline: 'none', resize: 'vertical', lineHeight: 1.6,
              marginBottom: 16,
            }}
            onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')}
            onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) generate() }}
          />

          {/* API tags */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginBottom: 8 }}>CLICK TO ADD API</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {AFRICAN_APIS.map(api => (
                <button key={api}
                  onClick={() => setPrompt(p => p ? `${p} using ${api}` : `Using ${api}, `)}
                  style={{
                    fontSize: 11, fontFamily: 'var(--font-mono)',
                    padding: '4px 10px', borderRadius: 100,
                    background: 'transparent', border: '1px solid var(--border)',
                    color: 'var(--text-muted)', cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(0,200,150,0.4)'
                    e.currentTarget.style.color = 'var(--accent)'
                    e.currentTarget.style.background = 'rgba(0,200,150,0.06)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.color = 'var(--text-muted)'
                    e.currentTarget.style.background = 'transparent'
                  }}>
                  {api}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ fontSize: 12, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
              ⌘ + Enter to generate
            </span>
            <button onClick={generate} disabled={loading || !prompt.trim()}
              style={{
                background: loading || !prompt.trim() ? '#1a1a1a' : 'var(--accent)',
                color: loading || !prompt.trim() ? 'var(--text-dim)' : '#000',
                border: 'none', padding: '12px 28px', borderRadius: 8,
                fontWeight: 700, fontSize: 14, cursor: loading || !prompt.trim() ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-display)',
                display: 'inline-flex', alignItems: 'center', gap: 8,
                transition: 'all 0.15s',
              }}>
              {loading ? (
                <><span style={{ width: 14, height: 14, border: '2px solid #444', borderTopColor: 'var(--accent)', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} /> Generating...</>
              ) : (
                <><Sparkles size={15} /> Generate workflow</>
              )}
            </button>
          </div>
        </div>

        {/* Examples */}
        {!result && !loading && (
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 12, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginBottom: 12 }}>TRY AN EXAMPLE</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {EXAMPLES.map(ex => (
                <button key={ex} onClick={() => setPrompt(ex)}
                  style={{
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    borderRadius: 8, padding: '12px 16px',
                    fontSize: 13, color: 'var(--text-muted)',
                    cursor: 'pointer', textAlign: 'left',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                    transition: 'all 0.15s',
                    fontFamily: 'var(--font-body)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(0,200,150,0.3)'
                    e.currentTarget.style.color = 'var(--text)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.color = 'var(--text-muted)'
                  }}>
                  {ex}
                  <ArrowRight size={14} style={{ flexShrink: 0 }} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div style={{
            background: 'var(--bg-card)', border: '1px solid rgba(0,200,150,0.2)',
            borderRadius: 14, padding: '40px 32px', textAlign: 'center',
          }}>
            <div style={{
              width: 48, height: 48, border: '3px solid #1a1a1a',
              borderTopColor: 'var(--accent)', borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 20px',
            }} />
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, color: 'var(--text)', marginBottom: 8 }}>
              {step}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              Building your n8n workflow with African API context
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(232,67,147,0.06)', border: '1px solid rgba(232,67,147,0.2)',
            borderRadius: 10, padding: '16px 20px',
            display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20,
          }}>
            <AlertCircle size={16} color="#e84393" />
            <span style={{ fontSize: 14, color: '#e84393' }}>{error}</span>
          </div>
        )}

        {/* Result */}
        {result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Explanation */}
            <div style={{
              background: 'rgba(0,200,150,0.06)', border: '1px solid rgba(0,200,150,0.2)',
              borderRadius: 12, padding: '20px 24px',
              display: 'flex', gap: 14,
            }}>
              <CheckCircle size={18} color="var(--accent)" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--accent)', marginBottom: 6 }}>
                  Workflow generated
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>
                  {result.explanation}
                </p>
              </div>
            </div>

            {/* JSON output */}
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 12, overflow: 'hidden',
            }}>
              {/* Toolbar */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 20px', borderBottom: '1px solid var(--border)',
                background: '#0d0d0d',
              }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
                  workflow.json
                </span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={handleCopy}
                    style={{
                      background: copied ? 'rgba(0,200,150,0.1)' : '#1a1a1a',
                      border: `1px solid ${copied ? 'rgba(0,200,150,0.3)' : 'var(--border)'}`,
                      color: copied ? 'var(--accent)' : 'var(--text-muted)',
                      padding: '6px 14px', borderRadius: 6, cursor: 'pointer',
                      fontSize: 12, fontFamily: 'var(--font-mono)',
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                    {copied ? <><CheckCircle size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
                  </button>
                  <button onClick={handleDownload}
                    style={{
                      background: 'var(--accent)', border: 'none',
                      color: '#000', padding: '6px 14px', borderRadius: 6,
                      cursor: 'pointer', fontSize: 12, fontFamily: 'var(--font-mono)',
                      fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                    <Download size={12} /> Download
                  </button>
                </div>
              </div>

              {/* JSON code */}
              <pre style={{
                padding: '20px', margin: 0,
                fontSize: 12, fontFamily: 'var(--font-mono)',
                color: '#a8d8a8', lineHeight: 1.65,
                overflowX: 'auto', maxHeight: 480,
                background: 'transparent',
              }}>
                {result.workflow}
              </pre>
            </div>

            {/* How to use */}
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 12, padding: '20px 24px',
            }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 14 }}>
                How to use this workflow
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  'Download the workflow.json file above',
                  'Open your n8n instance → Workflows → Import → select the file',
                  'Go to Settings → Credentials and add credentials for each API used',
                  'Replace any YOUR_* placeholder values with your real API keys',
                  'Activate the workflow and test it',
                ].map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                      background: 'rgba(0,200,150,0.1)', border: '1px solid rgba(0,200,150,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 700, color: 'var(--accent)',
                      fontFamily: 'var(--font-mono)', marginTop: 1,
                    }}>{i + 1}</div>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Generate another */}
            <button onClick={() => { setResult(null); setPrompt('') }}
              style={{
                background: 'transparent', border: '1px solid var(--border)',
                color: 'var(--text-muted)', padding: '12px 24px', borderRadius: 8,
                cursor: 'pointer', fontSize: 14, fontFamily: 'var(--font-body)',
                display: 'flex', alignItems: 'center', gap: 8, margin: '0 auto',
              }}>
              Generate another workflow
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

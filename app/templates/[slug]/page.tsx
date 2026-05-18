'use client'
import { use, useState } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Download, ArrowLeft, ExternalLink, GitFork, CheckCircle, Copy, BookOpen, GitBranch } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { templates, categoryMeta, difficultyMeta } from '@/data/registry'
import { readmes } from '@/data/readmes'
import { workflowDiagrams, getDefaultDiagram } from '@/data/workflows'

// Node type colors and labels
const nodeStyles: Record<string, { bg: string; border: string; color: string; label: string }> = {
  trigger:   { bg: 'rgba(0,200,150,0.12)',  border: 'rgba(0,200,150,0.5)',  color: '#00c896', label: 'Trigger' },
  action:    { bg: 'rgba(74,144,226,0.12)', border: 'rgba(74,144,226,0.5)', color: '#4a90e2', label: 'Action' },
  condition: { bg: 'rgba(245,166,35,0.12)', border: 'rgba(245,166,35,0.5)', color: '#f5a623', label: 'Condition' },
  code:      { bg: 'rgba(232,67,147,0.12)', border: 'rgba(232,67,147,0.5)', color: '#e84393', label: 'Code' },
}

function WorkflowDiagram({ templateId, apis, difficulty }: { templateId: string; apis: string[]; difficulty: string }) {
  const diagram = workflowDiagrams[templateId] || getDefaultDiagram(apis, difficulty)
  const { nodes, edges } = diagram

  // Calculate canvas size
  const xs = nodes.map(n => n.x)
  const ys = nodes.map(n => n.y)
  const minX = Math.min(...xs), maxX = Math.max(...xs)
  const minY = Math.min(...ys), maxY = Math.max(...ys)
  const cols = maxX - minX + 1
  const rows = maxY - minY + 1

  const nodeW = 110, nodeH = 40, gapX = 60, gapY = 56
  const canvasW = cols * (nodeW + gapX) - gapX + 40
  const canvasH = rows * (nodeH + gapY) - gapY + 40

  const getPos = (x: number, y: number) => ({
    cx: (x - minX) * (nodeW + gapX) + nodeW / 2 + 20,
    cy: (y - minY) * (nodeH + gapY) + nodeH / 2 + 20,
    left: (x - minX) * (nodeW + gapX) + 20,
    top: (y - minY) * (nodeH + gapY) + 20,
  })

  return (
    <div style={{ overflowX: 'auto', padding: '8px 0' }}>
      <div style={{ position: 'relative', width: canvasW, height: canvasH, minWidth: '100%' }}>
        {/* SVG edges */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
          {edges.map((edge, i) => {
            const from = nodes.find(n => n.id === edge.from)
            const to = nodes.find(n => n.id === edge.to)
            if (!from || !to) return null
            const fp = getPos(from.x, from.y)
            const tp = getPos(to.x, to.y)
            const midX = (fp.cx + tp.cx) / 2
            return (
              <g key={i}>
                <path
                  d={`M ${fp.cx} ${fp.cy} C ${midX} ${fp.cy}, ${midX} ${tp.cy}, ${tp.cx} ${tp.cy}`}
                  fill="none" stroke="#2a2a2a" strokeWidth="2"
                />
                <circle cx={tp.cx} cy={tp.cy} r="3" fill="#3a3a3a" />
              </g>
            )
          })}
        </svg>

        {/* Nodes */}
        {nodes.map(node => {
          const style = nodeStyles[node.type] || nodeStyles.action
          const pos = getPos(node.x, node.y)
          return (
            <div key={node.id} style={{
              position: 'absolute',
              left: pos.left, top: pos.top,
              width: nodeW, height: nodeH,
              background: style.bg,
              border: `1px solid ${style.border}`,
              borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-mono)', fontSize: 10.5,
              color: style.color, fontWeight: 600,
              padding: '0 8px', textAlign: 'center',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              cursor: 'default',
            }} title={node.label}>
              {node.label}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
        {Object.entries(nodeStyles).map(([type, s]) => (
          <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: s.bg, border: `1px solid ${s.border}` }} />
            <span style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ReadmeContent({ content }: { content: string }) {
  return (
    <div style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.8 }}>
      {content.split('\n').map((line, i) => {
        if (line.startsWith('## ')) {
          return <h3 key={i} style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--text)', margin: '20px 0 10px' }}>{line.replace('## ', '')}</h3>
        }
        if (line.startsWith('- ')) {
          return <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}><span style={{ color: 'var(--accent)', flexShrink: 0 }}>·</span><span>{line.replace('- ', '').replace(/\`([^`]+)\`/g, (_, c) => c)}</span></div>
        }
        if (/^\d+\./.test(line)) {
          const num = line.match(/^(\d+)\./)?.[1]
          const text = line.replace(/^\d+\.\s*/, '')
          return (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'flex-start' }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(0,200,150,0.1)', border: '1px solid rgba(0,200,150,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'var(--accent)', flexShrink: 0, marginTop: 1, fontFamily: 'var(--font-mono)' }}>{num}</div>
              <span>{text.replace(/\`([^`]+)\`/g, (_, c) => c)}</span>
            </div>
          )
        }
        if (line.trim() === '') return <div key={i} style={{ height: 4 }} />
        return <p key={i} style={{ marginBottom: 8 }}>{line.replace(/\`([^`]+)\`/g, (_, c) => c)}</p>
      })}
    </div>
  )
}

export default function TemplatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const template = templates.find(t => t.id === slug)
  if (!template) notFound()

  const cat = categoryMeta[template.category]
  const diff = difficultyMeta[template.difficulty]
  const related = templates
    .filter(t => t.id !== template.id && (t.category === template.category || t.apis.some(a => template.apis.includes(a))))
    .slice(0, 3)

  const [downloaded, setDownloaded] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [downloadCount, setDownloadCount] = useState(template.downloads)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'setup' | 'readme' | 'diagram'>('setup')

  const readme = readmes[template.id]

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const url = `https://raw.githubusercontent.com/OpenStack-Africa/templates/main/${template.path}/workflow.json`
      const response = await fetch(url)
      const blob = await response.blob()
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `${template.id}-workflow.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(link.href)
      setDownloaded(true)
      setTimeout(() => setDownloaded(false), 4000)
      const tracked = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: template.id }),
      })
      const data = await tracked.json()
      setDownloadCount(data.downloads)
    } catch {
      alert('Download failed. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  const handleCopyJSON = async () => {
    try {
      const url = `https://raw.githubusercontent.com/OpenStack-Africa/templates/main/${template.path}/workflow.json`
      const response = await fetch(url)
      const text = await response.text()
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      alert('Copy failed. Please try downloading instead.')
    }
  }

  const tabs = [
    { id: 'setup', label: 'Setup', icon: <BookOpen size={13} /> },
    { id: 'readme', label: 'README', icon: <BookOpen size={13} />, hide: !readme },
    { id: 'diagram', label: 'Diagram', icon: <GitBranch size={13} /> },
  ].filter(t => !t.hide)

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />

      {/* Download toast */}
      {downloaded && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 999,
          background: '#0a2e1f', border: '1px solid rgba(0,200,150,0.4)',
          borderRadius: 10, padding: '14px 20px',
          display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          animation: 'fadeUp 0.3s ease',
        }}>
          <CheckCircle size={18} color="var(--accent)" />
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Download complete</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{template.id}-workflow.json saved to your device</div>
          </div>
        </div>
      )}

      {/* Copy toast */}
      {copied && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 999,
          background: '#0a2e1f', border: '1px solid rgba(0,200,150,0.4)',
          borderRadius: 10, padding: '14px 20px',
          display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}>
          <CheckCircle size={18} color="var(--accent)" />
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Copied to clipboard</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Paste directly into n8n → Import</div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 940, margin: '0 auto', padding: '40px 1.5rem 100px' }}>

        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', textDecoration: 'none', fontSize: 13, marginBottom: 40, fontFamily: 'var(--font-mono)' }}>
          <ArrowLeft size={14} /> Back to templates
        </Link>

        {/* Header card */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 'clamp(20px, 4vw, 36px) clamp(20px, 4vw, 40px)', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${cat.color}44, ${cat.color})` }} />

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: `${cat.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{cat.icon}</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: cat.color, background: `${cat.color}14`, padding: '2px 10px', borderRadius: 100, border: `1px solid ${cat.color}30` }}>{cat.label}</span>
                  <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: diff.color, background: `${diff.color}14`, padding: '2px 10px', borderRadius: 100, border: `1px solid ${diff.color}30` }}>{diff.label}</span>
                </div>
              </div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.3rem, 3vw, 2rem)', lineHeight: 1.15, letterSpacing: '-0.03em', color: 'var(--text)', marginBottom: 12 }}>{template.title}</h1>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>{template.description}</p>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
              <button onClick={handleDownload} disabled={downloading}
                style={{
                  background: downloaded ? '#0a2e1f' : 'var(--accent)',
                  border: downloaded ? '1px solid rgba(0,200,150,0.4)' : 'none',
                  color: downloaded ? 'var(--accent)' : '#000',
                  padding: '12px 22px', borderRadius: 10,
                  fontWeight: 700, fontSize: 14, cursor: downloading ? 'wait' : 'pointer',
                  fontFamily: 'var(--font-display)',
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  transition: 'all 0.2s', whiteSpace: 'nowrap',
                  opacity: downloading ? 0.7 : 1,
                }}>
                {downloaded ? <><CheckCircle size={15} /> Downloaded!</> : downloading ? <><Download size={15} /> Downloading...</> : <><Download size={15} /> Download JSON</>}
              </button>

              <button onClick={handleCopyJSON}
                style={{
                  background: copied ? 'rgba(0,200,150,0.08)' : '#151515',
                  border: `1px solid ${copied ? 'rgba(0,200,150,0.3)' : 'var(--border)'}`,
                  color: copied ? 'var(--accent)' : 'var(--text-muted)',
                  padding: '10px 22px', borderRadius: 10,
                  fontWeight: 600, fontSize: 13, cursor: 'pointer',
                  fontFamily: 'var(--font-display)',
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  transition: 'all 0.2s', whiteSpace: 'nowrap',
                }}>
                {copied ? <><CheckCircle size={14} /> Copied!</> : <><Copy size={14} /> Copy JSON</>}
              </button>
            </div>
          </div>

          {/* Meta row */}
          <div style={{ display: 'flex', gap: 'clamp(16px, 4vw, 32px)', marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
            {[
              { label: 'Author', value: template.author.name },
              { label: 'Location', value: template.author.location },
              { label: 'n8n version', value: `v${template.n8n_version_min}+` },
              { label: 'Downloads', value: downloadCount.toString() },
              { label: 'Added', value: new Date(template.created_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main content + sidebar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 20 }}>

          {/* Tabbed content */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  style={{
                    padding: '14px 20px', background: 'transparent',
                    border: 'none', borderBottom: `2px solid ${activeTab === tab.id ? 'var(--accent)' : 'transparent'}`,
                    color: activeTab === tab.id ? 'var(--text)' : 'var(--text-muted)',
                    cursor: 'pointer', fontSize: 13, fontWeight: activeTab === tab.id ? 600 : 400,
                    fontFamily: 'var(--font-body)',
                    display: 'flex', alignItems: 'center', gap: 6,
                    transition: 'color 0.15s',
                  }}>
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div style={{ padding: 'clamp(20px, 3vw, 28px) clamp(20px, 3vw, 32px)' }}>

              {/* Setup tab */}
              {activeTab === 'setup' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {[
                    { step: 1, title: 'Download the workflow', detail: 'Click the Download JSON button above to save the workflow.json file to your device.' },
                    { step: 2, title: 'Import into n8n', detail: 'In your n8n instance: Workflows → Import → select the downloaded file.' },
                    { step: 3, title: 'Set up credentials', detail: `Create credentials for: ${template.apis.join(', ')}. Go to Settings → Credentials → Add Credential.` },
                    { step: 4, title: 'Replace placeholders', detail: 'Find any YOUR_* values in the workflow nodes and replace with your real credentials.' },
                    { step: 5, title: 'Activate & test', detail: 'Toggle the workflow active and trigger a test run. Check the execution log for any errors.' },
                  ].map(({ step, title, detail }) => (
                    <div key={step} style={{ display: 'flex', gap: 14 }}>
                      <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(0,200,150,0.10)', border: '1px solid rgba(0,200,150,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'var(--accent)', flexShrink: 0, marginTop: 1 }}>{step}</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{title}</div>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* README tab */}
              {activeTab === 'readme' && readme && <ReadmeContent content={readme} />}

              {/* Diagram tab */}
              {activeTab === 'diagram' && (
                <div>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
                    Visual overview of the workflow nodes and how they connect. Each node represents a step in the automation.
                  </p>
                  <WorkflowDiagram templateId={template.id} apis={template.apis} difficulty={template.difficulty} />
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* APIs */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '22px 24px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', marginBottom: 14 }}>APIs used</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {template.apis.map(api => (
                  <div key={api} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 8, background: '#151515', border: '1px solid var(--border)' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text)' }}>{api}</span>
                    <ExternalLink size={12} color="var(--text-dim)" />
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '22px 24px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', marginBottom: 14 }}>Tags</h3>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {template.tags.map(tag => (
                  <span key={tag} style={{ fontSize: 11, fontFamily: 'var(--font-mono)', padding: '3px 10px', borderRadius: 100, background: '#151515', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>#{tag}</span>
                ))}
              </div>
            </div>

            {/* GitHub */}
            <a href={`https://github.com/OpenStack-Africa/templates/tree/main/${template.path}`}
              target="_blank" rel="noopener noreferrer"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'var(--text)', fontSize: 13, fontWeight: 500 }}>
              <GitFork size={16} color="var(--text-muted)" />
              View on GitHub
              <ExternalLink size={12} color="var(--text-dim)" style={{ marginLeft: 'auto' }} />
            </a>

            {/* Contributor */}
            {template.author.contributorId && (
              <Link href={`/contributors/${template.author.contributorId}`}
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,200,150,0.1)', border: '1px solid rgba(0,200,150,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-display)', flexShrink: 0 }}>
                  {template.author.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{template.author.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>View profile →</div>
                </div>
              </Link>
            )}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', marginBottom: 14 }}>Related templates</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
              {related.map(t => {
                const rc = categoryMeta[t.category]
                return (
                  <Link key={t.id} href={`/templates/${t.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '18px 20px', cursor: 'pointer' }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-hover)')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
                      <div style={{ fontSize: 18, marginBottom: 8 }}>{rc.icon}</div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, color: 'var(--text)', marginBottom: 6, lineHeight: 1.3 }}>{t.title}</div>
                      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                        {t.apis.slice(0, 2).map(api => (
                          <span key={api} style={{ fontSize: 10, fontFamily: 'var(--font-mono)', padding: '2px 6px', borderRadius: 4, background: '#181818', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>{api}</span>
                        ))}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

'use client'
import { use, useEffect, useState, useRef } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download, Share2 } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { getContributorById } from '@/data/contributors'
import { templates } from '@/data/registry'

function getAvatarColor(id: string) {
  const colors = ['#00c896', '#f5a623', '#4a90e2', '#e84393', '#9b59b6', '#e67e22']
  return colors[id.charCodeAt(0) % colors.length]
}

export default function CertificatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const contributor = getContributorById(slug)
  if (!contributor) notFound()

  const color = getAvatarColor(contributor.id)
  const theirTemplates = templates.filter(t => t.author.contributorId === contributor.id)
  const [totalDownloads, setTotalDownloads] = useState(0)
  const [copied, setCopied] = useState(false)
  const certRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/download')
      .then(r => r.json())
      .then(data => {
        const counts = data.counts || {}
        const total = theirTemplates.reduce((sum, t) => sum + (counts[t.id] || 0), 0)
        setTotalDownloads(total)
      })
      .catch(() => {})
  }, [])

  const joinedDate = new Date(contributor.joined).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  const issuedDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  const handleShare = () => {
    const url = `${window.location.origin}/contributors/${slug}/certificate`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleDownload = () => {
    window.print()
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 2rem 80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
          <Link href={`/contributors/${slug}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', textDecoration: 'none', fontSize: 13, fontFamily: 'var(--font-mono)' }}>
            <ArrowLeft size={14} /> Back to profile
          </Link>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleShare}
              style={{ background: '#151515', border: '1px solid var(--border)', color: copied ? 'var(--accent)' : 'var(--text-muted)', padding: '9px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: 7 }}>
              <Share2 size={14} /> {copied ? 'Link copied!' : 'Share'}
            </button>
            <button onClick={handleDownload}
              style={{ background: 'var(--accent)', border: 'none', color: '#000', padding: '9px 18px', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: 7 }}>
              <Download size={14} /> Download
            </button>
          </div>
        </div>

        {/* Certificate */}
        <div ref={certRef} style={{
          background: '#080808',
          border: '1px solid #1e1e1e',
          borderRadius: 20,
          padding: '56px 64px',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'var(--font-display)',
        }}>
          {/* Background pattern */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.03, pointerEvents: 'none' }} viewBox="0 0 800 600">
            {Array.from({ length: 12 }).map((_, i) => (
              <line key={i} x1={i * 70} y1="0" x2={i * 70} y2="600" stroke="#00c896" strokeWidth="1" />
            ))}
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={i} x1="0" y1={i * 70} x2="800" y2={i * 70} stroke="#00c896" strokeWidth="1" />
            ))}
          </svg>

          {/* Top accent bar */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: `linear-gradient(90deg, ${color}, #00c896, ${color})` }} />

          {/* Corner decorations */}
          <div style={{ position: 'absolute', top: 20, left: 20, width: 40, height: 40, border: `2px solid ${color}30`, borderRight: 'none', borderBottom: 'none', borderRadius: '4px 0 0 0' }} />
          <div style={{ position: 'absolute', top: 20, right: 20, width: 40, height: 40, border: `2px solid ${color}30`, borderLeft: 'none', borderBottom: 'none', borderRadius: '0 4px 0 0' }} />
          <div style={{ position: 'absolute', bottom: 20, left: 20, width: 40, height: 40, border: `2px solid ${color}30`, borderRight: 'none', borderTop: 'none', borderRadius: '0 0 0 4px' }} />
          <div style={{ position: 'absolute', bottom: 20, right: 20, width: 40, height: 40, border: `2px solid ${color}30`, borderLeft: 'none', borderTop: 'none', borderRadius: '0 0 4px 0' }} />

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48 }}>
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#00c896"/>
              <rect x="7" y="10" width="18" height="2.5" rx="1.25" fill="#000"/>
              <rect x="7" y="14.75" width="12" height="2.5" rx="1.25" fill="#000"/>
              <rect x="7" y="19.5" width="15" height="2.5" rx="1.25" fill="#000"/>
            </svg>
            <div>
              <div style={{ fontWeight: 800, fontSize: 13, color: '#efefef', letterSpacing: '-0.3px' }}>OpenStack Africa</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#00c896', letterSpacing: '0.1em' }}>COMMUNITY CERTIFICATE</div>
            </div>
          </div>

          {/* Main content */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 13, color: '#555', fontFamily: 'var(--font-mono)', letterSpacing: '0.12em', marginBottom: 20, textTransform: 'uppercase' }}>
              This is to certify that
            </div>

            {/* Avatar */}
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: `${color}18`, border: `3px solid ${color}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 24, fontWeight: 800, color }}>
              {contributor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>

            <div style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: '#efefef', letterSpacing: '-0.04em', marginBottom: 8, lineHeight: 1.1 }}>
              {contributor.name}
            </div>
            <div style={{ fontSize: 14, color: '#666', marginBottom: 36, fontFamily: 'var(--font-mono)' }}>
              {contributor.location}
            </div>

            <div style={{ fontSize: 15, color: '#888', lineHeight: 1.8, maxWidth: 540, margin: '0 auto 40px' }}>
              has made a verified contribution to the{' '}
              <span style={{ color: '#00c896', fontWeight: 600 }}>OpenStack Africa</span>
              {' '}community template library, helping African developers build better automation workflows.
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: 1, justifyContent: 'center', background: '#111', borderRadius: 12, overflow: 'hidden', border: '1px solid #1e1e1e', maxWidth: 480, margin: '0 auto' }}>
              {[
                { value: theirTemplates.length, label: 'Templates' },
                { value: totalDownloads.toLocaleString(), label: 'Downloads' },
                { value: joinedDate.split(' ')[1], label: 'Member since' },
              ].map(({ value, label }, i) => (
                <div key={label} style={{ flex: 1, padding: '18px 16px', background: i % 2 === 0 ? '#0d0d0d' : '#080808', textAlign: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.4rem', color: color, marginBottom: 4 }}>{value}</div>
                  <div style={{ fontSize: 11, color: '#555', fontFamily: 'var(--font-mono)' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Templates list */}
          {theirTemplates.length > 0 && (
            <div style={{ marginBottom: 40 }}>
              <div style={{ fontSize: 11, color: '#444', fontFamily: 'var(--font-mono)', textAlign: 'center', marginBottom: 14, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Contributed templates</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                {theirTemplates.map(t => (
                  <div key={t.id} style={{ fontSize: 12, fontFamily: 'var(--font-mono)', padding: '6px 14px', borderRadius: 100, background: `${color}0d`, border: `1px solid ${color}25`, color }}>
                    {t.title.length > 35 ? t.title.slice(0, 35) + '...' : t.title}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 28, borderTop: '1px solid #1a1a1a', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontSize: 12, color: '#444', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>Issued on</div>
              <div style={{ fontSize: 13, color: '#777', fontFamily: 'var(--font-mono)' }}>{issuedDate}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#00c896', letterSpacing: '-0.5px', marginBottom: 2 }}>openstack-africa.online</div>
              <div style={{ fontSize: 10, color: '#444', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>VERIFIED CONTRIBUTOR</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, color: '#444', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>Certificate ID</div>
              <div style={{ fontSize: 13, color: '#555', fontFamily: 'var(--font-mono)' }}>OSA-{contributor.id.slice(0, 8).toUpperCase()}</div>
            </div>
          </div>
        </div>

        {/* Share note */}
        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-dim)', marginTop: 20, fontFamily: 'var(--font-mono)' }}>
          Share this certificate on LinkedIn or Twitter to showcase your contribution to African open source
        </p>
      </div>

      <style>{`
        @media print {
          nav, .no-print, a[href]:after { display: none !important; }
          body { background: #080808 !important; }
        }
      `}</style>
    </div>
  )
}

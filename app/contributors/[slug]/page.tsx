'use client'
import { use, useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, AtSign, Calendar, Download } from 'lucide-react'
import { GitFork } from 'lucide-react'
import Navbar from '@/components/Navbar'
import TemplateCard from '@/components/TemplateCard'
import { contributors, getContributorById } from '@/data/contributors'
import { templates } from '@/data/registry'

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

function getAvatarColor(id: string) {
  const colors = ['#00c896', '#f5a623', '#4a90e2', '#e84393', '#9b59b6', '#e67e22']
  return colors[id.charCodeAt(0) % colors.length]
}

export default function ContributorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const contributor = getContributorById(slug)
  if (!contributor) notFound()

  const color = getAvatarColor(contributor.id)
  const theirTemplates = templates.filter(t => t.author.contributorId === contributor.id)
  const [downloadCounts, setDownloadCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    fetch('/api/download')
      .then(r => r.json())
      .then(data => setDownloadCounts(data.counts || {}))
      .catch(() => {})
  }, [])

  const totalDownloads = theirTemplates.reduce((sum, t) => sum + (downloadCounts[t.id] || 0), 0)
  const joinedDate = new Date(contributor.joined).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 2rem 100px' }}>

        <Link href="/contributors" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          color: 'var(--text-muted)', textDecoration: 'none',
          fontSize: 13, marginBottom: 40, fontFamily: 'var(--font-mono)',
        }}>
          <ArrowLeft size={14} /> All contributors
        </Link>

        {/* Profile card */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 16, padding: 'clamp(24px, 4vw, 40px)',
          marginBottom: 32, position: 'relative', overflow: 'hidden',
        }}>
          {/* Top accent */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 3,
            background: `linear-gradient(90deg, ${color}44, ${color})`,
          }} />

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap' }}>
            {/* Avatar */}
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: `${color}18`, border: `3px solid ${color}40`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800,
              color: color, flexShrink: 0,
            }}>{getInitials(contributor.name)}</div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <h1 style={{
                fontFamily: 'var(--font-display)', fontWeight: 800,
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                lineHeight: 1.1, letterSpacing: '-0.03em',
                color: 'var(--text)', marginBottom: 10,
              }}>{contributor.name}</h1>

              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 14 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--text-muted)' }}>
                  <MapPin size={13} /> {contributor.location}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--text-muted)' }}>
                  <Calendar size={13} /> Joined {joinedDate}
                </span>
              </div>

              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: 14, maxWidth: 560, marginBottom: 20 }}>
                {contributor.bio}
              </p>

              {/* Social links */}
              <div style={{ display: 'flex', gap: 10 }}>
                {contributor.twitter && (
                  <a href={`https://twitter.com/${contributor.twitter}`} target="_blank" rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 7,
                      padding: '7px 14px', borderRadius: 7,
                      background: '#1a1a1a', border: '1px solid var(--border)',
                      color: 'var(--text-muted)', textDecoration: 'none', fontSize: 13,
                    }}>
                    <AtSign size={14} /> @{contributor.twitter}
                  </a>
                )}
                {contributor.github && (
                  <a href={`https://github.com/${contributor.github}`} target="_blank" rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 7,
                      padding: '7px 14px', borderRadius: 7,
                      background: '#1a1a1a', border: '1px solid var(--border)',
                      color: 'var(--text-muted)', textDecoration: 'none', fontSize: 13,
                    }}>
                    <GitFork size={14} /> GitHub
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div style={{
            display: 'flex', gap: 32, marginTop: 28,
            paddingTop: 24, borderTop: '1px solid var(--border)',
            flexWrap: 'wrap',
          }}>
            {[
              { label: 'Templates', value: theirTemplates.length, icon: null },
              { label: 'Total downloads', value: totalDownloads.toLocaleString(), icon: <Download size={13} /> },
            ].map(({ label, value, icon }) => (
              <div key={label}>
                <div style={{
                  fontFamily: 'var(--font-display)', fontWeight: 800,
                  fontSize: '2rem', color: color, marginBottom: 2,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>{value}</div>
                <div style={{ fontSize: 12, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  {icon}{label}
                </div>
              </div>
            ))}

            {/* Contributor badge */}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
              <div style={{
                background: `${color}12`,
                border: `1px solid ${color}30`,
                borderRadius: 8, padding: '8px 16px',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: color, fontWeight: 500 }}>
                  OpenStack Africa Contributor
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Certificate CTA */}
        <div style={{ background: 'rgba(0,200,150,0.04)', border: '1px solid rgba(0,200,150,0.15)', borderRadius: 12, padding: '20px 24px', marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 4 }}>Contributor Certificate</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Download or share your verified contributor certificate</div>
          </div>
          <Link href={`/contributors/${contributor.id}/certificate`}
            style={{ background: 'var(--accent)', color: '#000', padding: '9px 18px', borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: 'none', fontFamily: 'var(--font-display)', display: 'inline-flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
            View Certificate →
          </Link>
        </div>

        {/* Their templates */}
        <div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: '1.15rem', marginBottom: 20, color: 'var(--text)',
          }}>
            Templates by {contributor.name.split(' ')[0]}
          </h2>

          {theirTemplates.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {theirTemplates.map(t => (
                <TemplateCard
                  key={t.id}
                  template={t}
                  downloadCount={downloadCounts[t.id] ?? 0}
                />
              ))}
            </div>
          ) : (
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 12, padding: '48px 32px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🔧</div>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                No templates yet — check back soon.
              </p>
            </div>
          )}
        </div>

        {/* Other contributors */}
        <div style={{ marginTop: 56 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', marginBottom: 16 }}>
            Other contributors
          </h2>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {contributors
              .filter(c => c.id !== contributor.id)
              .slice(0, 5)
              .map(c => {
                const c2 = getAvatarColor(c.id)
                return (
                  <Link key={c.id} href={`/contributors/${c.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 16px', borderRadius: 10,
                      background: 'var(--bg-card)', border: '1px solid var(--border)',
                      transition: 'border-color 0.15s',
                    }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = c2 + '50')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: `${c2}18`, border: `1.5px solid ${c2}40`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 800, color: c2,
                        fontFamily: 'var(--font-display)',
                      }}>{getInitials(c.name)}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{c.name.split(' ')[0]}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>{c.location.split(',')[0]}</div>
                      </div>
                    </div>
                  </Link>
                )
              })}
          </div>
        </div>
      </div>
    </div>
  )
}

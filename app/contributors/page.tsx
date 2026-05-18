'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, MapPin, AtSign } from 'lucide-react'
import { GitFork } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { contributors } from '@/data/contributors'
import { templates } from '@/data/registry'

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

function getAvatarColor(id: string) {
  const colors = ['#00c896', '#f5a623', '#4a90e2', '#e84393', '#9b59b6', '#e67e22']
  const index = id.charCodeAt(0) % colors.length
  return colors[index]
}

export default function ContributorsPage() {
  const [downloadCounts, setDownloadCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    fetch('/api/download')
      .then(r => r.json())
      .then(data => setDownloadCounts(data.counts || {}))
      .catch(() => {})
  }, [])

  const contributorsWithStats = contributors.map(c => {
    const theirTemplates = templates.filter(t => t.author.contributorId === c.id)
    const totalDownloads = theirTemplates.reduce((sum, t) => sum + (downloadCounts[t.id] || 0), 0)
    return { ...c, templates: theirTemplates, totalDownloads }
  }).sort((a, b) => b.templates.length - a.templates.length)

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 2rem 100px' }}>

        {/* Header */}
        <div style={{ marginBottom: 56, maxWidth: 600 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(0,200,150,0.08)', border: '1px solid rgba(0,200,150,0.2)',
            borderRadius: 100, padding: '5px 14px', marginBottom: 20,
            fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)',
          }}>
            <span style={{ width: 5, height: 5, background: 'var(--accent)', borderRadius: '50%' }} />
            {contributors.length} contributors
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            lineHeight: 1.1, letterSpacing: '-0.03em',
            color: 'var(--text)', marginBottom: 16,
          }}>
            The people building<br />
            <span style={{ color: 'var(--accent)' }}>OpenStack Africa</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.7 }}>
            Every template in this library was built by a developer in the African tech community solving a real problem. These are the people behind the work.
          </p>
        </div>

        {/* Contributors grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16, marginBottom: 64 }}>
          {contributorsWithStats.map(c => {
            const color = getAvatarColor(c.id)
            return (
              <Link key={c.id} href={`/contributors/${c.id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 14, padding: '28px 28px 24px',
                  transition: 'border-color 0.15s, transform 0.2s',
                  cursor: 'pointer', height: '100%',
                }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.borderColor = color + '50'
                    el.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.borderColor = 'var(--border)'
                    el.style.transform = 'translateY(0)'
                  }}>

                  {/* Avatar + name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: '50%',
                      background: `${color}18`,
                      border: `2px solid ${color}40`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 800,
                      color: color, flexShrink: 0,
                    }}>{getInitials(c.name)}</div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--text)', marginBottom: 3 }}>{c.name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-muted)' }}>
                        <MapPin size={11} />
                        {c.location}
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: 20 }}>
                    {c.bio}
                  </p>

                  {/* Stats */}
                  <div style={{
                    display: 'flex', gap: 20,
                    paddingTop: 16, borderTop: '1px solid var(--border)',
                    marginBottom: 16,
                  }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: color }}>{c.templates.length}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>templates</div>
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--text)' }}>{c.totalDownloads.toLocaleString()}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>downloads</div>
                    </div>
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
                      {c.twitter && (
                        <a href={`https://twitter.com/${c.twitter}`} target="_blank" rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          style={{ color: 'var(--text-dim)', display: 'flex', alignItems: 'center' }}>
                          <AtSign size={14} />
                        </a>
                      )}
                      {c.github && (
                        <a href={`https://github.com/${c.github}`} target="_blank" rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          style={{ color: 'var(--text-dim)', display: 'flex', alignItems: 'center' }}>
                          <GitFork size={14} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* View profile */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: color, fontFamily: 'var(--font-mono)' }}>
                    View profile <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Become a contributor CTA */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid rgba(0,200,150,0.15)',
          borderRadius: 14, padding: '40px 40px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 24,
        }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem', marginBottom: 8, letterSpacing: '-0.02em' }}>
              Want to be listed here?
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6, maxWidth: 480 }}>
              Submit a workflow template to the library and your profile goes live automatically. Your name, your template, your downloads — all public.
            </p>
          </div>
          <a href="https://github.com/OpenStack-Africa/templates/blob/main/Contributing.md"
            target="_blank" rel="noopener noreferrer"
            style={{
              background: 'var(--accent)', color: '#000',
              padding: '12px 24px', borderRadius: 8,
              fontWeight: 700, fontSize: 14, textDecoration: 'none',
              fontFamily: 'var(--font-display)',
              display: 'inline-flex', alignItems: 'center', gap: 8,
              flexShrink: 0,
            }}>
            Start contributing <ArrowRight size={15} />
          </a>
        </div>
      </div>
    </div>
  )
}

'use client'
import { useState, useMemo } from 'react'
import { Search, GitFork, ArrowRight } from 'lucide-react'
import Navbar from '@/components/Navbar'
import TemplateCard from '@/components/TemplateCard'
import { templates, categoryMeta, Category } from '@/data/registry'

export default function Home() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<'all' | Category>('all')

  const filtered = useMemo(() => {
    return templates.filter(t => {
      const matchCat = activeCategory === 'all' || t.category === activeCategory
      const q = search.toLowerCase()
      const matchSearch = !q || t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.apis.some(a => a.includes(q)) ||
        t.tags.some(tag => tag.includes(q))
      return matchCat && matchSearch
    })
  }, [search, activeCategory])

  const totalDownloads = templates.reduce((sum, t) => sum + t.downloads, 0)

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />

      <section style={{ maxWidth: 840, margin: '0 auto', padding: '90px 2rem 70px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(0,200,150,0.08)', border: '1px solid rgba(0,200,150,0.2)',
          borderRadius: 100, padding: '6px 16px', marginBottom: 32,
          fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)',
        }}>
          <span style={{ width: 6, height: 6, background: 'var(--accent)', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
          Built for African developers, by African developers
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 'clamp(2.2rem, 5.5vw, 3.8rem)',
          lineHeight: 1.08, letterSpacing: '-0.04em',
          color: 'var(--text)', marginBottom: 24,
        }}>
          n8n workflows for{' '}
          <span style={{ color: 'var(--accent)' }}>African</span>{' '}
          business contexts
        </h1>

        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: 540, margin: '0 auto 40px', lineHeight: 1.75 }}>
          A community library of ready-made automation templates using Paystack, Flutterwave, Termii, Kuda, Moniepoint and more.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#templates" style={{
            background: 'var(--accent)', color: '#000', padding: '12px 24px', borderRadius: 8,
            fontWeight: 700, fontSize: 14, textDecoration: 'none', fontFamily: 'var(--font-display)',
            display: 'inline-flex', alignItems: 'center', gap: 8,
          }}>Browse templates <ArrowRight size={16} /></a>
          <a href="https://github.com/OpenStack-Africa" target="_blank" rel="noopener noreferrer" style={{
            background: 'transparent', color: 'var(--text)', padding: '12px 24px', borderRadius: 8,
            fontWeight: 500, fontSize: 14, textDecoration: 'none',
            border: '1px solid var(--border-hover)',
            display: 'inline-flex', alignItems: 'center', gap: 8,
          }}><GitFork size={15} /> View on GitHub</a>
        </div>
      </section>

      <div style={{ maxWidth: 840, margin: '0 auto', padding: '0 2rem 80px' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden',
          background: 'var(--border)', gap: 1,
        }}>
          {[
            { num: templates.length, label: 'Templates available' },
            { num: new Set(templates.flatMap(t => t.apis)).size, label: 'APIs covered' },
            { num: totalDownloads.toLocaleString(), label: 'Total downloads' },
          ].map(({ num, label }) => (
            <div key={label} style={{ background: 'var(--bg-card)', padding: '28px 24px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--accent)', marginBottom: 4 }}>{num}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <section id="templates" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2rem 100px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem' }}>All templates</span>
          <span style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        <div style={{ position: 'relative', marginBottom: 20 }}>
          <Search size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input type="text" placeholder="Search by name, API, or use case..." value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 8, padding: '13px 20px 13px 46px', fontSize: 14,
              color: 'var(--text)', fontFamily: 'var(--font-body)', outline: 'none',
            }}
            onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
          <button onClick={() => setActiveCategory('all')} style={{
            padding: '7px 16px', borderRadius: 100, fontSize: 13, fontWeight: 500, cursor: 'pointer',
            border: `1px solid ${activeCategory === 'all' ? 'rgba(0,200,150,0.3)' : 'var(--border)'}`,
            background: activeCategory === 'all' ? 'rgba(0,200,150,0.10)' : 'transparent',
            color: activeCategory === 'all' ? 'var(--accent)' : 'var(--text-muted)',
            fontFamily: 'var(--font-body)',
          }}>All</button>
          {(Object.entries(categoryMeta) as [Category, typeof categoryMeta[Category]][]).map(([key, meta]) => (
            <button key={key} onClick={() => setActiveCategory(key)} style={{
              padding: '7px 16px', borderRadius: 100, fontSize: 13, fontWeight: 500, cursor: 'pointer',
              border: `1px solid ${activeCategory === key ? `${meta.color}44` : 'var(--border)'}`,
              background: activeCategory === key ? `${meta.color}12` : 'transparent',
              color: activeCategory === key ? meta.color : 'var(--text-muted)',
              fontFamily: 'var(--font-body)',
            }}>{meta.icon} {meta.label}</button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
            {filtered.map(t => <TemplateCard key={t.id} template={t} />)}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-dim)' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
            <p style={{ fontSize: 14 }}>No templates found. <a href="https://github.com/OpenStack-Africa/templates/blob/main/CONTRIBUTING.md" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Submit the one you built.</a></p>
          </div>
        )}
      </section>

      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2rem 100px' }}>
        <div style={{
          background: 'var(--bg-card)', border: '1px solid rgba(0,200,150,0.15)',
          borderRadius: 16, padding: '56px 48px',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 48, alignItems: 'center',
        }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.9rem', lineHeight: 1.2, marginBottom: 16, letterSpacing: '-0.02em' }}>
              Built something useful? <span style={{ color: 'var(--accent)' }}>Share it.</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.7 }}>
              Every template here was built by a developer solving a real problem. Submit it — the whole community benefits.
            </p>
            <a href="https://github.com/OpenStack-Africa/templates/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer" style={{
              background: 'var(--accent)', color: '#000', padding: '12px 24px', borderRadius: 8,
              fontWeight: 700, fontSize: 14, textDecoration: 'none', fontFamily: 'var(--font-display)',
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>Read contributing guide <ArrowRight size={15} /></a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              'Fork the repo and create your template folder',
              'Add workflow.json, README.md, and a preview screenshot',
              'Remove all credentials — use placeholders like YOUR_PAYSTACK_SECRET_KEY',
              'Open a Pull Request — reviewed within 3 business days',
            ].map((text, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(0,200,150,0.10)', border: '1px solid rgba(0,200,150,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'var(--accent)', marginTop: 2,
                }}>{i + 1}</div>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer style={{
        borderTop: '1px solid var(--border)', padding: '32px 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        maxWidth: 1100, margin: '0 auto', flexWrap: 'wrap', gap: 16,
      }}>
        <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>
          Built by the African developer community · <a href="https://twitter.com/chuukkaa_OG" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none' }}>@chuukkaa_OG</a>
        </p>
        <div style={{ display: 'flex', gap: 20 }}>
          {[{ href: 'https://github.com/OpenStack-Africa', label: 'GitHub' }, { href: 'https://docs.n8n.io', label: 'n8n Docs' }, { href: '/submit', label: 'Submit' }].map(({ href, label }) => (
            <a key={href} href={href} style={{ fontSize: 13, color: 'var(--text-dim)', textDecoration: 'none' }}>{label}</a>
          ))}
        </div>
      </footer>
    </div>
  )
}

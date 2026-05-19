'use client'
import { useState, useMemo, useEffect } from 'react'
import { Search, ArrowRight, Clock, Users, Globe, Zap } from 'lucide-react'
import { GitFork } from 'lucide-react'
import Navbar from '@/components/Navbar'
import TemplateCard from '@/components/TemplateCard'
import { templates, categoryMeta, Category } from '@/data/registry'

// African city coordinates mapped to SVG viewBox 0 0 900 500
const ACTIVITY_DOTS = [
  { city: 'Lagos', x: 370, y: 285, count: 3 },
  { city: 'Abuja', x: 385, y: 268, count: 2 },
  { city: 'Port Harcourt', x: 390, y: 292, count: 1 },
  { city: 'Accra', x: 355, y: 278, count: 2 },
  { city: 'Nairobi', x: 520, y: 298, count: 1 },
  { city: 'Kigali', x: 500, y: 300, count: 1 },
  { city: 'Cape Town', x: 460, y: 400, count: 1 },
  { city: 'Cairo', x: 480, y: 190, count: 1 },
  { city: 'Dakar', x: 320, y: 255, count: 1 },
  { city: 'Kampala', x: 508, y: 293, count: 1 },
]

function ActivityMap() {
  const [hovered, setHovered] = useState<string | null>(null)
  return (
    <div style={{ position: 'relative', background: '#0a0a0a', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)' }}>
      <svg viewBox="0 0 900 500" style={{ width: '100%', display: 'block' }}>
        {/* Africa outline — simplified path */}
        <path d="M 340 140 L 360 130 L 400 128 L 440 132 L 470 145 L 490 160 L 510 155 L 530 165 L 545 185 L 548 210 L 540 235 L 545 255 L 540 275 L 530 295 L 520 315 L 515 340 L 505 360 L 490 378 L 475 392 L 460 400 L 448 408 L 435 405 L 420 398 L 405 388 L 392 375 L 380 360 L 370 342 L 360 320 L 350 300 L 342 278 L 335 258 L 328 238 L 325 215 L 322 192 L 325 170 L 332 155 Z"
          fill="#0f1f14" stroke="#00c89625" strokeWidth="1.5" />

        {/* Grid lines subtle */}
        {[200, 250, 300, 350, 400].map(y => (
          <line key={y} x1="280" y1={y} x2="600" y2={y} stroke="#ffffff" strokeWidth="0.3" opacity="0.04" />
        ))}
        {[320, 370, 420, 470, 520, 570].map(x => (
          <line key={x} x1={x} y1="120" x2={x} y2="420" stroke="#ffffff" strokeWidth="0.3" opacity="0.04" />
        ))}

        {/* Activity dots */}
        {ACTIVITY_DOTS.map(dot => (
          <g key={dot.city} onMouseEnter={() => setHovered(dot.city)} onMouseLeave={() => setHovered(null)} style={{ cursor: 'pointer' }}>
            {/* Pulse ring */}
            <circle cx={dot.x} cy={dot.y} r={dot.count > 1 ? 14 : 10} fill="rgba(0,200,150,0.06)" stroke="rgba(0,200,150,0.15)" strokeWidth="1">
              <animate attributeName="r" values={`${dot.count > 1 ? 10 : 7};${dot.count > 1 ? 18 : 14};${dot.count > 1 ? 10 : 7}`} dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0;0.6" dur="2.5s" repeatCount="indefinite" />
            </circle>
            {/* Core dot */}
            <circle cx={dot.x} cy={dot.y} r={dot.count > 1 ? 5 : 3.5}
              fill={hovered === dot.city ? '#00c896' : '#00c89688'}
              stroke="#00c896" strokeWidth="1" />
            {/* Tooltip */}
            {hovered === dot.city && (
              <g>
                <rect x={dot.x - 40} y={dot.y - 32} width="80" height="22" rx="5" fill="#0a2e1f" stroke="rgba(0,200,150,0.4)" strokeWidth="1" />
                <text x={dot.x} y={dot.y - 17} textAnchor="middle" fill="#00c896" fontSize="10" fontFamily="monospace">{dot.city}</text>
              </g>
            )}
          </g>
        ))}

        {/* Label */}
        <text x="30" y="480" fill="#2a2a2a" fontSize="11" fontFamily="monospace">OpenStack Africa · Developer Activity Map</text>
      </svg>
    </div>
  )
}

export default function Home() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<'all' | Category>('all')
  const [downloadCounts, setDownloadCounts] = useState<Record<string, number>>({})
  const [impact, setImpact] = useState({ totalDownloads: 0, hoursSaved: 0, countries: 5, contributors: 7 })

  useEffect(() => {
    fetch('/api/download')
      .then(r => r.json())
      .then(data => { setDownloadCounts(data.counts || {}); })
      .catch(() => {})

    fetch('/api/impact')
      .then(r => r.json())
      .then(data => setImpact(data))
      .catch(() => {})
  }, [])

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

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />

      {/* HERO */}
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
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(2.2rem, 5.5vw, 3.8rem)', lineHeight: 1.08, letterSpacing: '-0.04em', color: 'var(--text)', marginBottom: 24 }}>
          n8n workflows for{' '}<span style={{ color: 'var(--accent)' }}>African</span>{' '}business contexts
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: 540, margin: '0 auto 40px', lineHeight: 1.75 }}>
          A community library of ready-made automation templates using Paystack, Flutterwave, Termii, Kuda, Moniepoint and more.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#templates" style={{ background: 'var(--accent)', color: '#000', padding: '12px 24px', borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none', fontFamily: 'var(--font-display)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            Browse templates <ArrowRight size={16} />
          </a>
          <a href="https://github.com/OpenStack-Africa/templates" target="_blank" rel="noopener noreferrer" style={{ background: 'transparent', color: 'var(--text)', padding: '12px 24px', borderRadius: 8, fontWeight: 500, fontSize: 14, textDecoration: 'none', border: '1px solid var(--border-hover)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <GitFork size={15} /> View on GitHub
          </a>
        </div>
      </section>

      {/* IMPACT STATS */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2rem 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          {[
            { icon: <Zap size={18} />, value: templates.length, label: 'Templates', color: '#00c896' },
            { icon: <Clock size={18} />, value: impact.hoursSaved > 0 ? `${impact.hoursSaved.toLocaleString()}h` : '0h', label: 'Developer hours saved', color: '#f5a623' },
            { icon: <Users size={18} />, value: impact.contributors, label: 'Contributors', color: '#4a90e2' },
            { icon: <Globe size={18} />, value: impact.countries, label: 'African countries', color: '#e84393' },
          ].map(({ icon, value, label, color }) => (
            <div key={label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 22px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}14`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>{icon}</div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', color: 'var(--text)', lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ACTIVITY MAP */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2rem 64px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)', marginBottom: 4 }}>Developer activity across Africa</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Where our contributors and users are building from</p>
          </div>
          <a href="/status" style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: 5, border: '1px solid rgba(0,200,150,0.2)', padding: '6px 12px', borderRadius: 6, background: 'rgba(0,200,150,0.05)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />
            View API Status →
          </a>
        </div>
        <ActivityMap />
      </div>

      {/* TEMPLATES */}
      <section id="templates" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2rem 100px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem' }}>All templates</span>
          <span style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        <div style={{ position: 'relative', marginBottom: 20 }}>
          <Search size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input type="text" placeholder="Search by name, API, or use case..." value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '13px 20px 13px 46px', fontSize: 14, color: 'var(--text)', fontFamily: 'var(--font-body)', outline: 'none' }}
            onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
          <button onClick={() => setActiveCategory('all')} style={{ padding: '7px 16px', borderRadius: 100, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: `1px solid ${activeCategory === 'all' ? 'rgba(0,200,150,0.3)' : 'var(--border)'}`, background: activeCategory === 'all' ? 'rgba(0,200,150,0.10)' : 'transparent', color: activeCategory === 'all' ? 'var(--accent)' : 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>All</button>
          {(Object.entries(categoryMeta) as [Category, typeof categoryMeta[Category]][]).map(([key, meta]) => (
            <button key={key} onClick={() => setActiveCategory(key)} style={{ padding: '7px 16px', borderRadius: 100, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: `1px solid ${activeCategory === key ? `${meta.color}44` : 'var(--border)'}`, background: activeCategory === key ? `${meta.color}12` : 'transparent', color: activeCategory === key ? meta.color : 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>{meta.icon} {meta.label}</button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
            {filtered.map(t => <TemplateCard key={t.id} template={t} downloadCount={downloadCounts[t.id] ?? 0} />)}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-dim)' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
            <p style={{ fontSize: 14 }}>No templates found. <a href="https://github.com/OpenStack-Africa/templates/blob/main/Contributing.md" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Submit the one you built.</a></p>
          </div>
        )}
      </section>

      {/* SUBMIT CTA */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2rem 100px' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(0,200,150,0.15)', borderRadius: 16, padding: 'clamp(32px, 5vw, 56px) clamp(24px, 5vw, 48px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 48, alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.9rem', lineHeight: 1.2, marginBottom: 16, letterSpacing: '-0.02em' }}>
              Built something useful? <span style={{ color: 'var(--accent)' }}>Share it.</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.7 }}>Every template here was built by a developer solving a real problem. Submit it — the whole community benefits.</p>
            <a href="https://github.com/OpenStack-Africa/templates/blob/main/Contributing.md" target="_blank" rel="noopener noreferrer" style={{ background: 'var(--accent)', color: '#000', padding: '12px 24px', borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none', fontFamily: 'var(--font-display)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Read contributing guide <ArrowRight size={15} />
            </a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {['Fork the repo and create your template folder', 'Add workflow.json, README.md, and a preview screenshot', 'Remove all credentials — use placeholders like YOUR_PAYSTACK_SECRET_KEY', 'Open a Pull Request — reviewed within 3 business days'].map((text, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0, background: 'rgba(0,200,150,0.10)', border: '1px solid rgba(0,200,150,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'var(--accent)', marginTop: 2 }}>{i + 1}</div>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '32px 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1100, margin: '0 auto', flexWrap: 'wrap', gap: 16 }}>
        <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>
          Built by the African developer community · <a href="https://twitter.com/chuukkaa_OG" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none' }}>@chuukkaa_OG</a>
        </p>
        <div style={{ display: 'flex', gap: 20 }}>
          {[{ href: 'https://github.com/OpenStack-Africa/templates', label: 'GitHub' }, { href: '/status', label: 'API Status' }, { href: 'https://docs.n8n.io', label: 'n8n Docs' }, { href: '/submit', label: 'Submit' }].map(({ href, label }) => (
            <a key={href} href={href} style={{ fontSize: 13, color: 'var(--text-dim)', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-dim)')}>
              {label}
            </a>
          ))}
        </div>
      </footer>

      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }`}</style>
    </div>
  )
}

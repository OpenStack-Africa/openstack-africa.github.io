import Link from 'next/link'
import { Download, ArrowUpRight } from 'lucide-react'
import { Template, categoryMeta, difficultyMeta } from '@/data/registry'

interface Props {
  template: Template
  downloadCount?: number
}

export default function TemplateCard({ template, downloadCount = 0 }: Props) {
  const cat = categoryMeta[template.category]
  const diff = difficultyMeta[template.difficulty]

  return (
    <Link href={`/templates/${template.id}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: '22px 24px',
        cursor: 'pointer',
        transition: 'border-color 0.15s, background 0.15s, transform 0.2s',
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
      }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.borderColor = 'var(--border-hover)'
          el.style.background = 'var(--bg-card-hover)'
          el.style.transform = 'translateY(-3px)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.borderColor = 'var(--border)'
          el.style.background = 'var(--bg-card)'
          el.style.transform = 'translateY(0)'
        }}>

        {/* Top accent line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, ${cat.color}44, ${cat.color})`,
          opacity: 0.6,
        }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 8,
            background: `${cat.color}14`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, flexShrink: 0,
          }}>{cat.icon}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              fontSize: 11, fontFamily: 'var(--font-mono)',
              color: diff.color, background: `${diff.color}14`,
              padding: '2px 8px', borderRadius: 100,
              border: `1px solid ${diff.color}30`,
            }}>{diff.label}</span>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 11,
              color: 'var(--text-dim)',
              display: 'flex', alignItems: 'center', gap: 3,
            }}>
              <Download size={10} />
              {downloadCount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Title */}
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, color: 'var(--text)', marginBottom: 8, lineHeight: 1.35 }}>
          {template.title}
        </div>

        {/* Description */}
        <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: 16 }}>
          {template.description}
        </div>

        {/* API tags */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
          {template.apis.map(api => (
            <span key={api} style={{
              fontSize: 11, fontFamily: 'var(--font-mono)',
              padding: '3px 8px', borderRadius: 4,
              background: '#181818', border: '1px solid var(--border)',
              color: 'var(--text-muted)',
            }}>{api}</span>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingTop: 14, borderTop: '1px solid var(--border)',
        }}>
          <div style={{ fontSize: 12, color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{
              width: 20, height: 20, borderRadius: '50%',
              background: 'var(--accent-dim)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 9, fontWeight: 700, color: 'var(--accent)',
            }}>
              {template.author.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            {template.author.name.split(' ')[0]} · {template.author.location.split(',')[0]}
          </div>
          <span style={{ fontSize: 12, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 3, fontFamily: 'var(--font-mono)' }}>
            View <ArrowUpRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  )
}

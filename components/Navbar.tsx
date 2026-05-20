'use client'
import Link from 'next/link'
import { GitFork } from 'lucide-react'

export default function Navbar() {
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(8,8,8,0.92)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border)',
      padding: '0 clamp(1rem, 4vw, 2rem)',
      height: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', flexShrink: 0 }}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" rx="8" fill="#00c896"/>
          <rect x="7" y="10" width="18" height="2.5" rx="1.25" fill="#000"/>
          <rect x="7" y="14.75" width="12" height="2.5" rx="1.25" fill="#000"/>
          <rect x="7" y="19.5" width="15" height="2.5" rx="1.25" fill="#000"/>
        </svg>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14, color: 'var(--text)', lineHeight: 1.1, letterSpacing: '-0.3px' }}>OpenStack</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 400, fontSize: 10, color: 'var(--accent)', lineHeight: 1.1, letterSpacing: '0.08em' }}>AFRICA</div>
        </div>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.8rem, 3vw, 1.8rem)' }}>
        {[
          { href: '/#templates', label: 'Templates' },
          { href: '/contributors', label: 'Contributors' },
          { href: '/generate', label: '✦ Generate' },
          { href: '/requests', label: 'Requests' },
          { href: '/status', label: 'Status' },
          { href: '/submit', label: 'Submit' },
        ].map(({ href, label }) => (
          <Link key={href} href={href}
            style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 14, transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
            {label}
          </Link>
        ))}
        <a href="https://github.com/OpenStack-Africa/templates" target="_blank" rel="noopener noreferrer"
          style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5, textDecoration: 'none', fontSize: 14 }}>
          <GitFork size={15} />
        </a>
        <a href="https://github.com/OpenStack-Africa/templates/blob/main/Contributing.md"
          target="_blank" rel="noopener noreferrer"
          style={{
            background: 'var(--accent)', color: '#000',
            padding: '7px 14px', borderRadius: 6,
            fontWeight: 600, fontSize: 13, textDecoration: 'none',
            fontFamily: 'var(--font-display)', whiteSpace: 'nowrap',
          }}>
          Contribute →
        </a>
      </div>
    </nav>
  )
}

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
      padding: '0 2rem',
      height: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <div style={{
          width: 30, height: 30,
          background: 'var(--accent)',
          borderRadius: 7,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: '#000',
        }}>OS</div>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--text)', letterSpacing: '-0.3px' }}>
          OpenStack Africa
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        {[
          { href: '/#templates', label: 'Templates' },
          { href: '/submit', label: 'Submit' },
        ].map(({ href, label }) => (
          <Link key={href} href={href} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 14, transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
            {label}
          </Link>
        ))}
        <a href="https://github.com/openstack-africa" target="_blank" rel="noopener noreferrer"
          style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', fontSize: 14, transition: 'color 0.15s' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
          <GitFork size={15} /> GitHub
        </a>
        <a href="https://github.com/openstack-africa/templates/blob/main/CONTRIBUTING.md"
          target="_blank" rel="noopener noreferrer"
          style={{
            background: 'var(--accent)', color: '#000',
            padding: '7px 16px', borderRadius: 6,
            fontWeight: 600, fontSize: 13, textDecoration: 'none',
            fontFamily: 'var(--font-display)',
          }}>
          Contribute →
        </a>
      </div>
    </nav>
  )
}

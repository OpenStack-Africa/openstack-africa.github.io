'use client'
import Navbar from '@/components/Navbar'

export default function GeneratePage() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '120px 2rem', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.2)',
          borderRadius: 100, padding: '6px 16px', marginBottom: 24,
          fontFamily: 'var(--font-mono)', fontSize: 12, color: '#f5a623',
        }}>
          🔒 Coming Soon
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          letterSpacing: '-0.03em', color: 'var(--text)', marginBottom: 16,
        }}>
          AI Workflow Generator
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: 12 }}>
          Describe your workflow in plain English and we'll generate a ready-to-import n8n workflow JSON using African APIs — Paystack, Flutterwave, Termii and more.
        </p>
        <p style={{ color: 'var(--text-dim)', fontSize: 13, fontFamily: 'var(--font-mono)' }}>
          Powered by Claude AI · Launching soon
        </p>
      </div>
    </div>
  )
}

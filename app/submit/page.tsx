import Link from 'next/link'
import { ArrowLeft, GitFork, FileJson, Image, BookOpen, CheckCircle } from 'lucide-react'
import Navbar from '@/components/Navbar'

export default function SubmitPage() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 2rem 100px' }}>

        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', textDecoration: 'none', fontSize: 13, marginBottom: 40, fontFamily: 'var(--font-mono)' }}>
          <ArrowLeft size={14} /> Back to templates
        </Link>

        <div style={{ marginBottom: 48 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 2.8rem)', lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: 16 }}>
            Submit a template
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.7 }}>
            Every template here was built by a developer solving a real problem. If you built a workflow that others would use, this is how to share it.
          </p>
        </div>

        {/* Required files */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '28px 32px', marginBottom: 20 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', marginBottom: 20 }}>What to include</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { icon: <FileJson size={18} />, title: 'workflow.json', desc: 'The exported n8n workflow. Remove all API keys — use placeholders like YOUR_PAYSTACK_SECRET_KEY.', color: 'var(--accent)' },
              { icon: <BookOpen size={18} />, title: 'README.md', desc: 'Setup instructions a stranger can follow in under 10 minutes. Use the template format in CONTRIBUTING.md.', color: 'var(--amber)' },
              { icon: <Image size={18} />, title: 'preview.png', desc: 'A clean screenshot of the n8n workflow canvas. Minimum 1200px wide. No credentials visible.', color: 'var(--blue)' },
            ].map(({ icon, title, desc, color }) => (
              <div key={title} style={{ display: 'flex', gap: 16 }}>
                <div style={{ width: 38, height: 38, borderRadius: 8, background: `${color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
                  {icon}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 4 }}>{title}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '28px 32px', marginBottom: 20 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', marginBottom: 20 }}>How to submit</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { num: '1', title: 'Fork the repository', code: 'git clone https://github.com/openstack-africa/templates.git' },
              { num: '2', title: 'Create your template folder', code: 'mkdir templates/payments/paystack-webhook-slack' },
              { num: '3', title: 'Add your three files', code: 'workflow.json + README.md + preview.png' },
              { num: '4', title: 'Open a Pull Request', code: 'git commit -m "add: paystack webhook to slack template"' },
            ].map(({ num, title, code }) => (
              <div key={num} style={{ display: 'flex', gap: 16 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,200,150,0.10)', border: '1px solid rgba(0,200,150,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: 'var(--accent)', flexShrink: 0, marginTop: 2 }}>{num}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{title}</div>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)', background: 'rgba(0,200,150,0.06)', padding: '4px 10px', borderRadius: 5, display: 'inline-block' }}>{code}</code>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Checklist */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '28px 32px', marginBottom: 32 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', marginBottom: 20 }}>Before you submit</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              'Workflow imports and runs cleanly in n8n',
              'No real API keys in workflow.json',
              'README covers all setup steps end-to-end',
              'Preview screenshot is at least 1200px wide',
              'Folder name uses kebab-case',
              'PR title format: add: [template description]',
            ].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <CheckCircle size={16} color="var(--accent)" style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <a href="https://github.com/openstack-africa/templates" target="_blank" rel="noopener noreferrer" style={{
          background: 'var(--accent)', color: '#000', padding: '14px 28px', borderRadius: 8,
          fontWeight: 700, fontSize: 15, textDecoration: 'none', fontFamily: 'var(--font-display)',
          display: 'inline-flex', alignItems: 'center', gap: 10,
        }}>
          <GitFork size={18} /> Open the repository
        </a>
        <p style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 16 }}>
          Questions? Open an issue on GitHub or find us in the n8n Nigeria community.
        </p>

      </div>
    </div>
  )
}

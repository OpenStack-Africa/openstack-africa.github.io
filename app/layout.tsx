import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

export const metadata: Metadata = {
  title: 'OpenStack Africa — n8n Workflow Templates for African Developers',
  description: 'Free n8n workflow templates for Paystack, Flutterwave, Termii, Kuda, Moniepoint & more. Includes live African API status monitor, AI workflow generator, contributor profiles, and a community request board. Built by African developers, for African developers.',
  keywords: ['n8n', 'Africa', 'Paystack', 'Flutterwave', 'Termii', 'Nigeria', 'automation', 'workflow templates', 'African APIs', 'open source', 'Kuda', 'Moniepoint'],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'OpenStack Africa — n8n Workflow Templates for African Developers',
    description: 'Free n8n workflow templates for Paystack, Flutterwave, Termii, Kuda & more. Live African API status monitor, AI generator, contributor profiles and community request board.',
    url: 'https://openstack-africa.online',
    siteName: 'OpenStack Africa',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@chuukkaa_OG',
    title: 'OpenStack Africa — n8n Templates for African Developers',
    description: 'Free n8n workflow templates for Paystack, Flutterwave, Termii & more. Live African API status monitor, AI generator, and community request board.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

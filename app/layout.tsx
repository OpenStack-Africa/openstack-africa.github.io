import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'OpenStack Africa — n8n Templates for African Builders',
  description: 'A community library of n8n workflow templates built for African business contexts. Paystack, Flutterwave, Termii, Kuda, Moniepoint and more.',
  openGraph: {
    title: 'OpenStack Africa',
    description: 'n8n workflow templates built for African developers',
    url: 'https://openstackafrica.dev',
    siteName: 'OpenStack Africa',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', creator: '@chuukkaa_OG' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}

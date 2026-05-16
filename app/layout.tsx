import type { Metadata } from 'next'
import { DM_Sans, DM_Mono, Syne } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

const syne = Syne({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
})

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
    <html lang="en" suppressHydrationWarning className={`${syne.variable} ${dmSans.variable} ${dmMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}

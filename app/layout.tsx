import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ORBIS — One platform. Every business. Everywhere.',
  description: 'La premiere plateforme B2B mondiale — Business OS + 4 Marketplaces + IA avec Speech-to-Speech temps reel dans 12 langues.',
  keywords: 'B2B, marketplace, business, AI, SaaS, trade, wholesale, investors',
  authors: [{ name: 'ORBIS Inc', url: 'https://orbis-smoky-gamma.vercel.app' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ORBIS',
  },
  openGraph: {
    title: 'ORBIS — One platform. Every business. Everywhere.',
    description: 'La premiere plateforme B2B mondiale — Business OS + 4 Marketplaces + IA',
    type: 'website',
    locale: 'fr_FR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ORBIS — One platform. Every business. Everywhere.',
    description: 'La premiere plateforme B2B mondiale',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#B22234',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="ORBIS" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#B22234" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body style={{ margin: 0, padding: 0, background: '#060e1a' }}>
        {children}
      </body>
    </html>
  )
}

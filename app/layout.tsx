import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import './animations.css'
import { ThemeProvider } from '@/components/theme-provider'
import { AdminProvider } from '@/context/admin-context'
import { TubelightNavbar } from '@/components/TubelightNavbar'
import { Footer } from '@/components/Footer'
import { Analytics } from "@vercel/analytics/react"
import { seoConfig } from './seo-config'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://ajlandscaper.com'),
  title: {
    default: seoConfig.default.title,
    template: '%s | AJ Landscapers'
  },
  description: seoConfig.default.description,
  keywords: seoConfig.default.keywords,
  openGraph: seoConfig.default.openGraph,
  twitter: seoConfig.default.twitter,
  robots: seoConfig.default.robots,
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: '/',
  },
  authors: [
    { name: 'AJ Landscapers', url: 'https://ajlandscaper.com' }
  ],
  category: 'Landscaping Services',
  verification: {
    google: 'your-google-site-verification', // Add your Google verification code
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://ajlandscaper.com" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Analytics/>
          <AdminProvider>
            <TubelightNavbar />
            {children}
            <Footer />
          </AdminProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

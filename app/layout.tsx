import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import './animations.css'
import { ThemeProvider } from '@/components/theme-provider'
import { AdminProvider } from '@/context/admin-context'
import { TubelightNavbar } from '@/components/TubelightNavbar'
import { Footer } from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AJ Landscapers',
  description: 'Professional landscaping services for your outdoor spaces',
  icons: {
    icon: '/favicon.ico'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
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

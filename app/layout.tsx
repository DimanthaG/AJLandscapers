import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import './animations.css'
import { ThemeProvider } from '@/components/theme-provider'
import { AdminProvider } from '@/context/admin-context'
import { TubelightNavbar } from '@/components/TubelightNavbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'A&J Landscaping',
  description: 'Professional landscaping services in Western Mass',
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
          </AdminProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

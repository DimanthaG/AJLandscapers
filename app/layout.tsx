import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { TubelightNavbar } from '@/components/TubelightNavbar'
import { AdminProvider } from '@/context/admin-context'
import { AdminControls } from '@/components/AdminControls'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AJLandscapers - Professional Landscaping Services',
  description: 'Professional landscaping services in Scarborough and surrounding areas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} pb-28 md:pb-0`}>
        <AdminProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
          >
            <TubelightNavbar />
            {children}
            <AdminControls />
          </ThemeProvider>
        </AdminProvider>
      </body>
    </html>
  )
}

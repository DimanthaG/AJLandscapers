import { Inter } from "next/font/google"
import { AdminProvider } from "@/context/admin-context"
import { AdminControls } from "@/components/AdminControls"
import { TubelightNavbar } from "@/components/TubelightNavbar"
import { ThemeProvider } from "@/components/theme-provider"
import { siteConfig } from "@/config/site-config"
import { initializeContentCache } from "@/lib/contentCache"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

// Initialize default content in cache
const defaultContent = {
  'hero-title': siteConfig.hero.title,
  'hero-subtitle': siteConfig.hero.subtitle,
  'about-title': siteConfig.about.title,
  'about-description': siteConfig.about.description,
  ...siteConfig.about.features.reduce((acc, feature, index) => ({
    ...acc,
    [`feature-${index}`]: feature
  }), {}),
  ...siteConfig.defaultServices.reduce((acc, service, index) => ({
    ...acc,
    [`service-title-${index}`]: service.title,
    [`service-desc-${index}`]: service.description
  }), {})
}

initializeContentCache(defaultContent)

export const metadata = {
  title: siteConfig.business.name,
  description: siteConfig.hero.subtitle,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="aj-theme"
        >
          <AdminProvider>
            <TubelightNavbar />
            {children}
            <AdminControls />
          </AdminProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

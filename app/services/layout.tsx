import { seoConfig } from '../seo-config'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: seoConfig.pages.services.title,
  description: seoConfig.pages.services.description,
  openGraph: {
    ...seoConfig.default.openGraph,
    title: seoConfig.pages.services.title,
    description: seoConfig.pages.services.description,
  },
  alternates: {
    canonical: '/services',
  }
}

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 
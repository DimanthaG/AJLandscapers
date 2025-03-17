import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ajlandscaper.com'

  const routes = [
    '',
    '/about',
    '/services',
    '/gallery',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Add dynamic service pages
  const services = [
    'hardscape',
    'courtyard',
    'entrance',
    'dining',
    'escape',
    'hollywood',
    'railings',
    'fences',
    'gates',
    'warranty-fences'
  ].map((service) => ({
    url: `${baseUrl}/services/${service}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...routes, ...services]
} 
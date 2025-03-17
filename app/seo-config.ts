export const seoConfig = {
  default: {
    title: 'AJ Landscapers',
    description: 'Professional landscaping services in the Greater Toronto Area. Specializing in hardscaping, garden design, and outdoor living spaces.',
    keywords: 'landscaping, hardscaping, garden design, outdoor living, Toronto landscaper, GTA landscaping, professional landscaping',
    openGraph: {
      type: 'website',
      locale: 'en_CA',
      url: 'https://ajlandscapers.com',
      siteName: 'AJ Landscapers',
      images: [
        {
          url: '/images/logohorizontal.png',
          width: 1200,
          height: 630,
          alt: 'AJ Landscapers',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AJ Landscapers',
      description: 'Transform your outdoor space with professional landscaping services',
      images: ['/images/logohorizontal.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  },
  pages: {
    home: {
      title: 'AJ Landscapers - Professional Landscaping Services in Toronto',
      description: 'Transform your outdoor space with AJ Landscapers. Expert landscaping, hardscaping, and garden design services in the Greater Toronto Area.',
    },
    about: {
      title: 'About AJ Landscapers - Your Trusted Landscaping Experts',
      description: 'Learn about our 15+ years of experience in creating beautiful outdoor spaces. Professional, licensed, and insured landscaping services.',
    },
    services: {
      title: 'Our Services - Professional Landscaping & Hardscaping Solutions',
      description: 'Comprehensive landscaping services including hardscaping, garden design, outdoor dining spaces, and custom fence installations.',
    },
    contact: {
      title: 'Contact AJ Landscapers - Get Your Free Quote Today',
      description: 'Contact us for professional landscaping services in Toronto. Free consultations and quotes available.',
    },
    gallery: {
      title: 'Project Gallery - AJ Landscapers Portfolio',
      description: 'View our portfolio of completed landscaping and hardscaping projects in the Greater Toronto Area.',
    },
  },
} 
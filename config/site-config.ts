export type SiteConfig = {
  business: {
    name: string
    email: string
    phone: string
    representative: string
    developer: string
    licenseNumber: string
    hosting: string
    address: {
      street: string
      city: string
      province: string
      postalCode: string
    }
    hours: {
      monday: string
      tuesday: string
      wednesday: string
      thursday: string
      friday: string
      saturday: string
      sunday: string
    }
  }
  hero: {
    title: string
    subtitle: string
    cta: string
    image: string
  }
  about: {
    title: string
    description: string
    features: string[]
  }
  social: {
    facebook?: string
    twitter?: string
    instagram?: string
    linkedin?: string
  }
  defaultServices: Array<{
    title: string
    description: string
    image: string
  }>
}

export const siteConfig: SiteConfig = {
  business: {
    name: "AJ Landscapers",
    email: "info@ajlandscaper.com",
    phone: "(647) 614-4111",
    representative: "Arjun Jassal",
    licenseNumber: "L2024-001",
    hosting: "Vercel",
    developer: "Codavra.com",
    devemail: "info@codavra.com",
    address: {
      street: "100 Wingarden Ct",
      city: "Scarborough",
      province: "ON",
      postalCode: "M1B 2P4"
    },
    hours: {
      monday: "9:00 AM - 5:00 PM",
      tuesday: "9:00 AM - 5:00 PM",
      wednesday: "9:00 AM - 5:00 PM",
      thursday: "9:00 AM - 5:00 PM",
      friday: "9:00 AM - 5:00 PM",
      saturday: "10:00 AM - 4:00 PM",
      sunday: "Closed"
    }
  },
  hero: {
    title: "Transform Your Outdoor Space With Us!",
    subtitle: "Professional landscaping and hardscaping services in North York , Klinesburg, Mississauga Road, Bridle Path, the Beaches, Scarborough Bluffs , High Park and other upscale neighborhoods",
    cta: "Get Free Quote",
    image: "/images/HeroImage.jpg"
  },
  about: {
    title: "About AJ Landscaper",
    description: "With over 15 years of experience, we specialize in creating beautiful and functional outdoor spaces that exceed our clients' expectations.",
    features: [
      "Licensed & Insured",
      "Free Consultations",
      "Custom Designs",
      "Quality Materials",
      "Expert Installation",
      "Maintenance Services"
    ]
  },
  social: {
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/"
  },
  defaultServices: [
    {
      title: "Landscape Design",
      description: "Custom landscape design services tailored to your needs",
      image: "/images/services/landscape-design.jpg"
    },
    {
      title: "Hardscaping",
      description: "Professional hardscaping services for patios, walkways, and more",
      image: "/images/services/hardscaping.jpg"
    }
  ]
}
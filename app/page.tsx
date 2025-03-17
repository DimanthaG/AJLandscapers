"use client"

import { EditableContent } from "@/components/EditableContent"
import { EditableImage } from "@/components/EditableImage"
import { siteConfig } from "@/config/site-config"
import Link from "next/link"
import { useState, useEffect, useRef, FormEvent } from "react"
import "./animations.css"
import { ServicePreviewCard } from '@/components/ServicePreviewCard'
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from 'next/navigation'
import { makeEditable } from '@/utils/editMode'
import LoadingScreen from './components/LoadingScreen'

interface FormData {
  name: string
  email: string
  phone: string
  service: string
  customService?: string
  message: string
}

export default function Home(): JSX.Element {
  const [heroImage, setHeroImage] = useState("/images/HeroImage.jpg")
  const [scrollY, setScrollY] = useState(0)
  const servicesRef = useRef<HTMLDivElement>(null)
  const servicesScrollRef = useRef<HTMLDivElement>(null)
  const [showScrollHint, setShowScrollHint] = useState(true)
  const [showLeftScroll, setShowLeftScroll] = useState(false)
  const [showRightScroll, setShowRightScroll] = useState(true)
  const [imageScale, setImageScale] = useState(1)

  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    service: '',
    customService: '',
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const router = useRouter()

  const heroTitleRef = useRef<HTMLHeadingElement>(null)
  const heroSubtitleRef = useRef<HTMLParagraphElement>(null)
  const heroImageRef = useRef<HTMLImageElement>(null)
  const aboutTitleRef = useRef<HTMLHeadingElement>(null)
  const aboutDescRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    // Make elements editable in edit mode
    if (heroTitleRef.current) {
      makeEditable(heroTitleRef.current, 'hero.title', siteConfig.hero.title)
    }
    if (heroSubtitleRef.current) {
      makeEditable(heroSubtitleRef.current, 'hero.subtitle', siteConfig.hero.subtitle)
    }
    if (heroImageRef.current) {
      makeEditable(heroImageRef.current, 'hero.image', siteConfig.hero.image, 'image')
    }
    if (aboutTitleRef.current) {
      makeEditable(aboutTitleRef.current, 'about.title', siteConfig.about.title)
    }
    if (aboutDescRef.current) {
      makeEditable(aboutDescRef.current, 'about.description', siteConfig.about.description, 'richtext')
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            // Hide the scroll hint after the user has seen the services section
            setTimeout(() => setShowScrollHint(false), 5000)
          }
        })
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      }
    )
    
    if (servicesRef.current) {
      observer.observe(servicesRef.current)
    }
    
    const serviceItems = document.querySelectorAll('.service-item')
    serviceItems.forEach((item) => observer.observe(item))
    return () => {
      if (servicesRef.current) observer.unobserve(servicesRef.current)
      serviceItems.forEach((item) => observer.unobserve(item))
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const fetchHeroImage = async () => {
      try {
        const response = await fetch('/api/content?key=image-hero')
        const data = await response.json()
        if (data?.content) {
          setHeroImage(data.content)
        }
      } catch (error) {
      }
    }
    fetchHeroImage()
  }, [])

  // Handle horizontal scroll buttons
  const scrollLeft = () => {
    if (servicesScrollRef.current) {
      servicesScrollRef.current.scrollBy({ left: -300, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (servicesScrollRef.current) {
      servicesScrollRef.current.scrollBy({ left: 300, behavior: 'smooth' })
    }
  }

  // Update scroll indicators based on scroll position
  const handleScrollUpdate = () => {
    if (!servicesScrollRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = servicesScrollRef.current
    setShowLeftScroll(scrollLeft > 20)
    setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 20)
    
    // Hide the scroll hint once user starts scrolling manually
    if (scrollLeft > 10) {
      setShowScrollHint(false)
    }
  }

  useEffect(() => {
    const scrollContainer = servicesScrollRef.current
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScrollUpdate)
      // Initial check
      handleScrollUpdate()
      return () => scrollContainer.removeEventListener('scroll', handleScrollUpdate)
    }
  }, [])

  // Update image scale on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const newScale = 1 + (scrollY * 0.0005); // Subtle scale effect on scroll
      setImageScale(newScale);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let keys: string[] = []
    const adminCode = ['Control', 'Alt', 'a'] // Ctrl + Alt + A

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Control' || e.key === 'Alt' || e.key === 'a') {
        if (!keys.includes(e.key)) {
          keys.push(e.key)
        }

        // Check if all required keys are pressed
        if (adminCode.every(key => keys.includes(key))) {
          router.push('/login')
        }
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Control' || e.key === 'Alt' || e.key === 'a') {
        keys = keys.filter(key => key !== e.key)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [router])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          // Use customService if service is "Custom"
          service: formData.service === 'Custom' ? formData.customService : formData.service
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit form')
      }

      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        customService: '',
        message: ''
      })
      setShowSuccess(true)
    } catch (err) {
      setError('Failed to submit form. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset customService when a different service is selected
      ...(name === 'service' && value !== 'Custom' && { customService: '' })
    }))
  }

  return (
    <>
      <LoadingScreen />
      <main className="min-h-screen bg-[#111111]">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="animate-fade-up animate-duration-700 animate-delay-300">
                <EditableContent
                  content={siteConfig.hero.title}
                  id="hero-title"
                />
              </h1>
              <p className="animate-fade-up animate-duration-700 animate-delay-500">
                <EditableContent
                  content={siteConfig.hero.subtitle}
                  id="hero-subtitle"
                  as="span"
                />
              </p>
              <div className="animate-fade-up animate-duration-700 animate-delay-700">
                <Link 
                  href="/contact" 
                  className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-primary hover:bg-primary-light transition-all duration-300 rounded-lg hover:scale-105"
                >
                  <EditableContent
                    content={siteConfig.hero.cta}
                    id="hero-cta"
                  />
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-primary-light/30 rounded-[25px] blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
              <div className="hero-image-container relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent z-10 pointer-events-none" />
                <EditableImage
                  id="hero"
                  src={heroImage}
                  alt="Beautiful landscaping"
                  fill
                  className="object-cover transition-transform duration-300"
                  priority
                  style={{ transform: `scale(${imageScale})` }}
                />
              </div>
            </div>
          </div>
        </section>
        {/* Features Section */}
        <section className="bg-[#a3a300] py-8">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
            <div className="text-center">
              <p className="text-lg font-semibold text-black">TRUSTED</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-black">RELIABLE</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-black">QUALIFIED AND EXPERIENCED</p>
            </div>
          </div>
        </section>
        {/* Services Preview - Horizontal Scrollable Section */}
        <section className="section-padding bg-[#111111]/80" ref={servicesRef}>
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-8">
              <EditableContent
                content="Our Services"
                id="services-preview-title"
              />
            </h2>
            
            <div className={`text-center text-gray-400 mb-16 flex items-center justify-center ${showScrollHint ? 'scroll-hint-animation' : ''}`}>
              <ChevronLeft className="w-5 h-5 mr-2" /> 
              <span>Swipe or scroll to explore our services</span> 
              <ChevronRight className="w-5 h-5 ml-2" />
            </div>
            
            <div className="relative">
              {/* Left scroll button */}
              <button 
                onClick={scrollLeft}
                className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#111111]/70 text-white p-3 rounded-full shadow-xl hover:bg-[#a3a300] transition-all duration-300 ${!showLeftScroll ? 'opacity-0' : 'opacity-100'}`}
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              {/* Right scroll button */}
              <button 
                onClick={scrollRight}
                className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#111111]/70 text-white p-3 rounded-full shadow-xl hover:bg-[#a3a300] transition-all duration-300 ${!showRightScroll ? 'opacity-0' : 'opacity-100'}`} 
                aria-label="Scroll right"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              
              {/* Scrollable container */}
              <div 
                ref={servicesScrollRef} 
                className="flex overflow-x-auto pb-8 gap-6 hide-scrollbar snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none' }}
              >
                {[
                  { 
                    title: "Breath Taking Hard Scape", 
                    id: "hardscape",
                    image: "/images/IMG_18182.PNG"
                  },
                  { 
                    title: "Elegant Courtyards", 
                    id: "courtyard",
                    image: "/images/IMG_18052.PNG"
                  },
                  { 
                    title: "Scenic Entrances", 
                    id: "entrance",
                    image: "/images/IMG_18132.PNG"
                  },
                  { 
                    title: "Personal and Outdoor Dining", 
                    id: "dining",
                    image: "/images/IMG_1807.PNG"
                  },
                  { 
                    title: "Cosy and Quiet Escape", 
                    id: "escape",
                    image: "/images/CosyQuiet.jpg"
                  },
                  { 
                    title: "Hollywood Moment", 
                    id: "hollywood",
                    image: "/images/IMG_18032.PNG"
                  },
                  { 
                    title: "Timeless Railings", 
                    id: "railings",
                    image: "/images/TimelessRailings.jpg"
                  },
                  { 
                    title: "One of a Kind Garden Fences", 
                    id: "fences",
                    image: "/images/HeroImage.jpg"
                  },
                  { 
                    title: "Majestic Columns and Gates", 
                    id: "gates",
                    image: "/images/MajesticColumns.jpg"
                  },
                  { 
                    title: "High Quality Life Time Warranty Fences", 
                    id: "warranty-fences",
                    image: "/images/HighQualFences.jpg"
                  }
                ].map((service, index) => (
                  <div key={service.id} className="min-w-[300px] sm:min-w-[350px] flex-shrink-0 snap-start">
                    <ServicePreviewCard
                      key={service.id}
                      title={service.title}
                      image={service.image}
                      id={service.id}
                      index={index}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: 10 }).map((_, i) => (
                <button 
                  key={i}
                  className={`w-2 h-2 rounded-full bg-white/30 hover:bg-[#a3a300] transition-all`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
            
            <div className="text-center mt-16">
              <Link 
                href="/services" 
                className="inline-flex items-center px-8 py-4 text-lg font-semibold text-[#111111] bg-primary hover:bg-primary-light transition-all duration-300 rounded-lg hover:scale-105"
              >
                View All Services
              </Link>
            </div>
          </div>
        </section>
        {/* About Section */}
        <section className="section-padding bg-[#111111]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
                <EditableImage
                  id="about-preview"
                  src="/images/Landscapers.png"
                  alt="About us preview"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-8">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                  <EditableContent
                    content={siteConfig.about.title}
                    id="about-title"
                  />
                </h2>
                <div className="text-gray-600 dark:text-gray-300 text-lg">
                  <EditableContent
                    content={siteConfig.about.description}
                    id="about-description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  {siteConfig.about.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <svg className="w-6 h-6 text-primary flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">
                        <EditableContent
                          content={feature}
                          id={`feature-${index}`}
                        />
                      </span>
                    </div>
                  ))}
                </div>
                <Link href="/about" className="button-primary inline-block mt-6">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="section-padding bg-[#111111]/80">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="section-title text-gray-900 dark:text-white">Get Your Free Quote</h2>
            <div className="max-w-3xl mx-auto">
              {error && (
                <div className={`p-4 rounded-lg mb-6 bg-red-500/10 text-red-500`}>
                  {error}
                </div>
              )}
              {showSuccess && (
                <div className={`p-4 rounded-lg mb-6 bg-green-500/10 text-green-500`}>
                  Thank you for your quote request! We will get back to you soon.
                </div>
              )}
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Your Phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
                <div className="space-y-4">
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Service Type</option>
                    <optgroup label="Common Services">
                      {siteConfig.defaultServices.map((service, index) => (
                        <option key={index} value={service.title}>{service.title}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Additional Options">
                      <option value="Landscape Analysis">Landscape Analysis & Consultation</option>
                      <option value="Seasonal Maintenance">Seasonal Maintenance Package</option>
                      <option value="Irrigation">Irrigation System Installation/Repair</option>
                      <option value="Custom">Custom Service (Specify Below)</option>
                    </optgroup>
                  </select>

                  {formData.service === 'Custom' && (
                    <input
                      type="text"
                      name="customService"
                      value={formData.customService}
                      onChange={handleChange}
                      placeholder="Please specify your service needs"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  )}
                </div>
                <textarea
                  name="message"
                  placeholder="Project Details"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="md:col-span-2 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                ></textarea>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`md:col-span-2 button-primary py-4 ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Submitting...' : 'Get Quote'}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

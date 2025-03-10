"use client"

import { EditableContent } from "@/components/EditableContent"
import { EditableImage } from "@/components/EditableImage"
import { siteConfig } from "@/config/site-config"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function Home() {
  const [heroImage, setHeroImage] = useState("https://source.unsplash.com/1920x1080/?landscape,garden")

  useEffect(() => {
    // Try to fetch saved hero image from database
    const fetchHeroImage = async () => {
      try {
        const response = await fetch('/api/content?key=image-hero')
        const data = await response.json()
        if (data?.content) {
          setHeroImage(data.content)
        }
      } catch (error) {
        console.error('Error fetching hero image:', error)
      }
    }
    fetchHeroImage()
  }, [])

  return (
    <main className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="relative h-screen">
        <div className="absolute inset-0">
          <EditableImage
            id="hero"
            src={heroImage}
            alt="Beautiful landscaping"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 max-w-4xl">
            <EditableContent
              content={siteConfig.hero.title}
              id="hero-title"
            />
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl">
            <EditableContent
              content={siteConfig.hero.subtitle}
              id="hero-subtitle"
            />
          </p>
          <Link
            href="/contact"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            {siteConfig.hero.cta}
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-green-500 mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {siteConfig.defaultServices.slice(0, 3).map((service, index) => (
              <div
                key={index}
                className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors"
              >
                <h3 className="text-xl font-bold text-green-400 mb-4">
                  <EditableContent
                    content={service.title}
                    id={`service-title-${index}`}
                  />
                </h3>
                <p className="text-gray-400">
                  <EditableContent
                    content={service.description}
                    id={`service-desc-${index}`}
                  />
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/services"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-4 bg-gray-950 relative">
        <div className="absolute inset-0 bg-green-500/5" />
        <div className="max-w-4xl mx-auto relative">
          <h2 className="text-4xl font-bold text-center mb-8 text-green-500">
            <EditableContent
              content={siteConfig.about.title}
              id="about-title"
            />
          </h2>
          <p className="text-gray-300 text-center mb-12 text-lg">
            <EditableContent
              content={siteConfig.about.description}
              id="about-description"
            />
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {siteConfig.about.features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-900/50 backdrop-blur p-4 rounded-xl border border-gray-800"
              >
                <EditableContent
                  content={feature}
                  id={`feature-${index}`}
                  className="text-gray-300 text-center"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-green-500">
                <EditableContent
                  content={siteConfig.about.title}
                  id="about-title"
                />
              </h2>
              <div className="text-gray-300 text-lg">
                <EditableContent
                  content={siteConfig.about.description}
                  id="about-description"
                />
              </div>
              <Link
                href="/about"
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
              >
                Learn More
              </Link>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <EditableImage
                id="about-preview"
                src="https://source.unsplash.com/800x600/?landscape,garden"
                alt="About us preview"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-4 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-green-500">Contact Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-6 text-green-400">Contact Information</h3>
                <div className="space-y-4 text-gray-300">
                  <p>
                    <strong className="block text-white mb-1">Address:</strong>
                    {siteConfig.business.address.street}<br />
                    {siteConfig.business.address.city}, {siteConfig.business.address.province}
                  </p>
                  <p>
                    <strong className="block text-white mb-1">Phone:</strong>
                    {siteConfig.business.phone}
                  </p>
                  <p>
                    <strong className="block text-white mb-1">Email:</strong>
                    {siteConfig.business.email}
                  </p>
                </div>
              </div>
              <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-6 text-green-400">Business Hours</h3>
                <div className="space-y-3">
                  {Object.entries(siteConfig.business.hours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between text-gray-300">
                      <span className="capitalize">{day}:</span>
                      <span>{hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <form className="bg-gray-800 p-8 rounded-xl border border-gray-700">
              <h3 className="text-xl font-semibold mb-6 text-green-400">Get a Free Quote</h3>
              <div className="space-y-6">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Your Phone"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Project Details"
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder:text-gray-500"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all hover:shadow-lg hover:shadow-green-500/20"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-green-500 mb-6">{siteConfig.business.name}</h3>
              <p className="mb-2">{siteConfig.business.address.street}</p>
              <p>{siteConfig.business.address.city}, {siteConfig.business.address.province}</p>
            </div>
            <div className="text-right">
              <div className="space-y-2">
                <p>Phone: {siteConfig.business.phone}</p>
                <p>Email: {siteConfig.business.email}</p>
              </div>
              <div className="mt-6 flex justify-end space-x-6">
                {siteConfig.social.facebook && (
                  <a href={siteConfig.social.facebook} className="text-gray-400 hover:text-green-400 transition-colors">
                    Facebook
                  </a>
                )}
                {siteConfig.social.instagram && (
                  <a href={siteConfig.social.instagram} className="text-gray-400 hover:text-green-400 transition-colors">
                    Instagram
                  </a>
                )}
                {siteConfig.social.twitter && (
                  <a href={siteConfig.social.twitter} className="text-gray-400 hover:text-green-400 transition-colors">
                    Twitter
                  </a>
                )}
                {siteConfig.social.linkedin && (
                  <a href={siteConfig.social.linkedin} className="text-gray-400 hover:text-green-400 transition-colors">
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="mt-12 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} {siteConfig.business.name}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}

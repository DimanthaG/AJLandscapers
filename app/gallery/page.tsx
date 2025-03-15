"use client"

import { GalleryGrid } from "@/components/GalleryGrid"

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-[#111111]">
      {/* Hero Section */}
      <section className="hero-section" style={{ height: '60vh', minHeight: '400px' }}>
        <div className="absolute inset-0">
          <img
            src="https://source.unsplash.com/1600x900/?garden-landscaping"
            alt="Gallery Hero"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Our Portfolio</h1>
          <p className="text-xl text-gray-100 max-w-2xl mx-auto">
            Explore our collection of beautiful landscape transformations
          </p>
        </div>
      </section>

      {/* Gallery Grid Section */}
      <section className="section-padding bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Transform Your Outdoor Space
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Browse through our portfolio of completed projects and get inspired for your next landscape transformation.
            </p>
          </div>
          
          <GalleryGrid />
          
          <div className="text-center mt-16">
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Ready to start your landscape transformation? Contact us today for a free consultation and let's bring your vision to life.
            </p>
            <a
              href="/contact"
              className="button-primary text-lg inline-block"
            >
              Get Started
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
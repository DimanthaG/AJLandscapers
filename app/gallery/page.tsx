"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface CloudinaryImage {
  public_id: string
  secure_url: string
  width: number
  height: number
}

export default function GalleryPage() {
  const [images, setImages] = useState<CloudinaryImage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/gallery')
        const data = await response.json()
        setImages(data)
      } catch (error) {
        console.error('Error fetching images:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen bg-[#111111] pt-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square bg-[#1a1a1a] animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#111111]">
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-[#111111]">
        <div className="relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[#a3a300] mb-6">Our Gallery</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explore our portfolio of stunning landscaping projects
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <div key={image.public_id} className="group relative aspect-square rounded-lg overflow-hidden">
                <Image
                  src={image.secure_url}
                  alt="Gallery Image"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
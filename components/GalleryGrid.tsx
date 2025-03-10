"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useAdmin } from '@/context/admin-context'
import { Plus, X } from 'lucide-react'

interface GalleryImage {
  src: string
  alt: string
  width: number
  height: number
}

const defaultImages: GalleryImage[] = [
  {
    src: "https://source.unsplash.com/800x600/?landscape,garden",
    alt: "Beautiful Landscape Design",
    width: 800,
    height: 600,
  },
  {
    src: "https://source.unsplash.com/800x600/?garden,maintenance",
    alt: "Garden Maintenance",
    width: 800,
    height: 600,
  },
  {
    src: "https://source.unsplash.com/800x600/?lawn,grass",
    alt: "Professional Lawn Care",
    width: 800,
    height: 600,
  },
  {
    src: "https://source.unsplash.com/800x600/?patio,stonework",
    alt: "Custom Hardscaping",
    width: 800,
    height: 600,
  }
]

export function GalleryGrid() {
  const { isAdmin } = useAdmin()
  const [images, setImages] = useState<GalleryImage[]>(defaultImages)
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({})

  useEffect(() => {
    const savedImages = localStorage.getItem('galleryImages')
    if (savedImages) {
      try {
        const parsed = JSON.parse(savedImages)
        setImages(parsed.length > 0 ? parsed : defaultImages)
      } catch {
        setImages(defaultImages)
      }
    }
  }, [])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const newImage = {
          src: e.target?.result as string,
          alt: file.name,
          width: 600,
          height: 400
        }
        const updatedImages = [...images, newImage]
        setImages(updatedImages)
        localStorage.setItem('galleryImages', JSON.stringify(updatedImages))
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index)
    setImages(updatedImages.length > 0 ? updatedImages : defaultImages)
    localStorage.setItem('galleryImages', JSON.stringify(updatedImages))
  }

  const handleImageError = (index: number) => {
    setImageErrors(prev => ({ ...prev, [index]: true }))
  }

  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
      {images.map((image, index) => (
        !imageErrors[index] && (
          <div key={index} className="relative mb-4 break-inside-avoid group">
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              className="rounded-lg hover:opacity-90 transition-opacity"
              onError={() => handleImageError(index)}
            />
            {isAdmin && (
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            )}
          </div>
        )
      ))}
      
      {isAdmin && (
        <div className="relative mb-4 break-inside-avoid">
          <label className="block w-full aspect-[3/2] rounded-lg border-2 border-dashed border-green-500 hover:border-green-400 transition-colors cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-green-500">
              <Plus className="h-12 w-12 mb-2" />
              <span className="text-sm font-medium">Add New Image</span>
            </div>
          </label>
        </div>
      )}
    </div>
  )
}
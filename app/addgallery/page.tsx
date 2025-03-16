'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { CldUploadWidget } from 'next-cloudinary'
import type { CloudinaryUploadWidgetResults } from 'next-cloudinary'
import { Play } from 'lucide-react'

interface CloudinaryMedia {
  public_id: string
  secure_url: string
  width: number
  height: number
  resource_type: 'image' | 'video'
}

interface UploadWidgetProps {
  open: () => void
}

export default function AddGalleryPage() {
  const [media, setMedia] = useState<CloudinaryMedia[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMedia()
  }, [])

  const fetchMedia = async () => {
    try {
      const response = await fetch('/api/gallery')
      const data = await response.json()
      setMedia(data)
    } catch (error) {
      console.error('Error fetching media:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUploadSuccess = useCallback((results: CloudinaryUploadWidgetResults) => {
    if (results.info && typeof results.info === 'object' && 'public_id' in results.info) {
      fetchMedia() // Refresh the media list after successful upload
    }
  }, [])

  const handleDelete = async (publicId: string) => {
    try {
      const response = await fetch('/api/gallery', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publicId }),
      })

      if (!response.ok) {
        throw new Error('Failed to delete media')
      }

      fetchMedia() // Refresh the media list after deletion
    } catch (error) {
      console.error('Error deleting media:', error)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#111111] pt-32">
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
    <main className="min-h-screen bg-[#111111] pt-32">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#a3a300] mb-4">Manage Gallery</h1>
          <p className="text-gray-300">Upload and manage your gallery media here.</p>
        </div>

        {/* Upload Widget */}
        <div className="mb-12">
          <CldUploadWidget
            uploadPreset="ml_default"
            onSuccess={handleUploadSuccess}
            options={{
              folder: 'gallery',
              resourceType: 'auto'
            }}
          >
            {({ open }: UploadWidgetProps) => (
              <button
                onClick={() => open()}
                className="px-6 py-3 bg-[#a3a300] text-black font-semibold rounded-lg hover:bg-[#8a8a00] transition-colors"
              >
                Upload Media
              </button>
            )}
          </CldUploadWidget>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {media.map((item) => (
            <div key={item.public_id} className="group relative aspect-square rounded-lg overflow-hidden">
              {item.resource_type === 'video' ? (
                <>
                  <video
                    src={item.secure_url}
                    className="object-cover w-full h-full"
                    controls
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none">
                    <Play className="w-12 h-12 text-white opacity-75" />
                  </div>
                </>
              ) : (
                <Image
                  src={item.secure_url}
                  alt="Gallery Media"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button
                  onClick={() => handleDelete(item.public_id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
} 
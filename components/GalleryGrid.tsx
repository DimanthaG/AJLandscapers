"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useAdmin } from '@/context/admin-context'
import { Plus, X, Loader2, Play } from 'lucide-react'
import { compressImage, getImageDimensions } from '@/lib/imageUtils'
import { compressVideo } from '@/lib/videoUtils'

interface MediaItem {
  id: string
  src: string
  alt: string
  width: number
  height: number
  type: 'image' | 'video'
  duration?: number
  size?: number
  format?: string
}

const defaultImages: MediaItem[] = [
  {
    id: 'default-1',
    src: "https://source.unsplash.com/800x600/?landscape,garden",
    alt: "Beautiful Landscape Design",
    width: 800,
    height: 600,
    type: 'image'
  },
  {
    id: 'default-2',
    src: "https://source.unsplash.com/800x600/?garden,maintenance",
    alt: "Garden Maintenance",
    width: 800,
    height: 600,
    type: 'image'
  }
]

export function GalleryGrid() {
  const { isAdmin } = useAdmin()
  const [media, setMedia] = useState<MediaItem[]>(defaultImages)
  const [mediaErrors, setMediaErrors] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number>(0)

  useEffect(() => {
    fetchMedia()
  }, [])

  const fetchMedia = async () => {
    try {
      const response = await fetch('/api/gallery')
      const data = await response.json()
      setMedia(data.length > 0 ? data : defaultImages)
    } catch (error) {
      console.error('Error fetching media:', error)
      setMedia(defaultImages)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      if (file.type.startsWith('image/')) {
        await handleImageUpload(file)
      } else if (file.type.startsWith('video/')) {
        await handleVideoUpload(file)
      }
    } catch (error) {
      console.error('Error uploading file:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleImageUpload = async (file: File) => {
    const originalSize = file.size / (1024 * 1024) // Size in MB
    setUploadProgress(10)
    
    const compressedFile = await compressImage(file)
    const compressedSize = compressedFile.size / (1024 * 1024)
    setUploadProgress(50)
    
    const dimensions = await getImageDimensions(compressedFile)
    setUploadProgress(70)
    
    const reader = new FileReader()
    reader.onload = async (e) => {
      const base64Data = e.target?.result as string
      await uploadMedia(
        base64Data,
        file.name,
        dimensions.width,
        dimensions.height,
        'image',
        undefined,
        {
          originalSize,
          compressedSize,
        }
      )
      setUploadProgress(100)
      setTimeout(() => setUploadProgress(0), 1000)
    }
    reader.readAsDataURL(compressedFile)
  }

  const handleVideoUpload = async (file: File) => {
    const originalSize = file.size / (1024 * 1024)
    setUploadProgress(10)
    
    // Calculate target size based on original size
    const targetSize = Math.min(5, originalSize * 0.4) // 40% of original or 5MB, whichever is smaller
    
    const { blob, duration } = await compressVideo(file, {
      targetSize,
      maxBitrate: 800000,
      maxWidth: 854
    })
    setUploadProgress(70)
    
    const compressedSize = blob.size / (1024 * 1024)
    const reader = new FileReader()
    reader.onload = async (e) => {
      const base64Data = e.target?.result as string
      await uploadMedia(
        base64Data,
        file.name,
        854, // Standard width for compressed videos
        480, // Standard height for compressed videos
        'video',
        duration,
        {
          originalSize,
          compressedSize,
        }
      )
      setUploadProgress(100)
      setTimeout(() => setUploadProgress(0), 1000)
    }
    reader.readAsDataURL(blob)
  }

  // Update the upload media function to handle size tracking
  const uploadMedia = async (
    src: string,
    alt: string,
    width: number,
    height: number,
    type: 'image' | 'video',
    duration?: number,
    sizeInfo?: { originalSize: number; compressedSize: number }
  ) => {
    const response = await fetch('/api/gallery', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        src,
        alt,
        width,
        height,
        type,
        duration,
        sizeInfo
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to upload media')
    }

    const newMedia = await response.json()
    // Log with format if available
    console.log('Media upload complete:', {
      url: newMedia.src,
      size: newMedia.size,
      format: newMedia.format || 'unknown'
    })
    setMedia(prev => [...prev, newMedia])
  }

  const removeMedia = async (id: string) => {
    try {
      const response = await fetch(`/api/gallery?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete media')
      }

      setMedia(prev => prev.filter(item => item.id !== id))
    } catch (error) {
      console.error('Error deleting media:', error)
    }
  }

  const handleImageError = (id: string) => {
    setMediaErrors(prev => ({ ...prev, [id]: true }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
        {media.map((item) => (
          !mediaErrors[item.id] && (
            <div key={item.id} className="relative mb-4 break-inside-avoid group">
              {item.type === 'video' ? (
                <div className="relative aspect-video">
                  <video
                    src={item.src}
                    controls
                    className="w-full rounded-lg"
                    onError={() => handleImageError(item.id)}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                </div>
              ) : (
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  className="rounded-lg hover:opacity-90 transition-opacity"
                  onError={() => handleImageError(item.id)}
                />
              )}
              {isAdmin && (
                <button
                  onClick={() => removeMedia(item.id)}
                  className="absolute top-2 right-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              )}
            </div>
          )
        ))}
      </div>
      
      {isAdmin && (
        <div className="relative mb-4 break-inside-avoid">
          <label className={`block w-full aspect-[3/2] rounded-lg border-2 border-dashed border-green-500 hover:border-green-400 transition-colors cursor-pointer ${
            isUploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}>
            <input
              type="file"
              className="hidden"
              accept="image/*,video/*"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-green-500">
              {isUploading ? (
                <>
                  <Loader2 className="h-12 w-12 mb-2 animate-spin" />
                  <span className="text-sm font-medium">
                    Compressing... {uploadProgress}%
                  </span>
                </>
              ) : (
                <>
                  <Plus className="h-12 w-12 mb-2" />
                  <span className="text-sm font-medium">Add Media</span>
                  <span className="text-xs text-gray-400 mt-1">
                    Images will be compressed to ~300KB
                  </span>
                  <span className="text-xs text-gray-400">
                    Videos will be compressed to ~5MB
                  </span>
                </>
              )}
            </div>
          </label>
        </div>
      )}
    </div>
  )
}
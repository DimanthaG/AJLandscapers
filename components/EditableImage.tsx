"use client"

import { useState } from 'react'
import Image from 'next/image'
import { useAdmin } from '@/context/admin-context'
import { Edit3, Check, X, ImageIcon } from 'lucide-react'
import { uploadToCloudinary } from '@/lib/cloudinary'

interface EditableImageProps {
  id: string
  src: string
  alt: string
  fill?: boolean
  className?: string
  onUpdate?: (newSrc: string) => void
}

export function EditableImage({ id, src, alt, fill, className, onUpdate }: EditableImageProps) {
  const { isAdmin } = useAdmin()
  const [isEditing, setIsEditing] = useState(false)
  const [editedImage, setEditedImage] = useState(src)
  const [isUploading, setIsUploading] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      // Upload to Cloudinary
      const uploadResult = await uploadToCloudinary(file, {
        folder: 'website',
      })

      setEditedImage(uploadResult.secure_url)
      
      // Save to database if callback provided
      if (onUpdate) {
        onUpdate(uploadResult.secure_url)
      }

      // Update content in database
      await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: `image-${id}`,
          content: uploadResult.secure_url
        })
      })

      setIsEditing(false)
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleSave = async () => {
    try {
      await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: `image-${id}`,
          content: editedImage
        })
      })

      if (onUpdate) {
        onUpdate(editedImage)
      }
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving image:', error)
    }
  }

  if (isEditing && isAdmin) {
    return (
      <div className="relative p-6 bg-gray-800 rounded-xl border-2 border-green-500">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Image URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={editedImage}
                onChange={(e) => setEditedImage(e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-700 rounded-lg text-white"
              />
              <label className={`px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                isUploading ? 'bg-gray-600' : 'bg-green-600 hover:bg-green-700'
              }`}>
                <ImageIcon className="h-5 w-5 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-700">
            <Image
              src={editedImage}
              alt={alt}
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Check className="h-5 w-5" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image
        src={src}
        alt={alt}
        fill={fill}
        className={className}
      />
      {isAdmin && isHovered && (
        <button
          onClick={() => setIsEditing(true)}
          className="absolute top-2 right-2 p-2 bg-green-500 rounded-full hover:bg-green-600 transition-colors z-20"
        >
          <Edit3 className="h-4 w-4 text-white" />
        </button>
      )}
    </div>
  )
}
"use client"

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { useAdmin } from '@/context/admin-context'
import { Pencil } from 'lucide-react'
import { makeEditable } from '@/utils/editMode'

interface EditableImageProps {
  id: string
  src: string
  alt: string
  className?: string
  fill?: boolean
  width?: number
  height?: number
  onError?: () => void
  onUpdate?: (newSrc: string) => void
  priority?: boolean
  style?: React.CSSProperties
}

export const EditableImage = ({
  id,
  src,
  alt,
  className,
  fill,
  width,
  height,
  onError,
  onUpdate,
  priority = false,
  style
}: EditableImageProps) => {
  const { isAdmin } = useAdmin()
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (imageRef.current) {
      makeEditable(imageRef.current, id, src, 'image')
    }
  }, [id, src])

  const handleImageClick = async () => {
    if (!isAdmin) return

    try {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (!file) return

        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', 'my_uploads')

        const response = await fetch('/api/content', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            key: `image-${id}`,
            content: URL.createObjectURL(file)
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to upload image')
        }

        const data = await response.json()
        onUpdate?.(data.content)
      }

      input.click()
    } catch (error) {
      console.error('Error uploading image:', error)
    }
  }

  return (
    <div 
      className="relative w-full h-full"
      onMouseEnter={() => {}}
      onMouseLeave={() => {}}
    >
      <Image
        src={src}
        alt={alt}
        className={className}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        onClick={handleImageClick}
        onError={onError}
        style={{ objectFit: "cover", ...style }}
        priority={priority}
        ref={imageRef}
      />
      {isAdmin && (
        <button
          onClick={handleImageClick}
          className="absolute top-2 right-2 p-2 bg-primary rounded-full hover:bg-primary-light transition-colors z-20"
        >
          <Pencil className="h-4 w-4 text-white" />
        </button>
      )}
    </div>
  )
}
"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import Image from "next/image"
import { XIcon, ChevronLeft, ChevronRight } from "lucide-react"

interface ImageLightboxProps {
  isOpen: boolean
  onClose: () => void
  images: string[]
  currentImageIndex: number
  onNavigate: (index: number) => void
  alt: string
}

export function ImageLightbox({ 
  isOpen, 
  onClose, 
  images, 
  currentImageIndex, 
  onNavigate, 
  alt 
}: ImageLightboxProps) {
  const showPrevious = currentImageIndex > 0
  const showNext = currentImageIndex < images.length - 1

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-auto h-auto p-0 border-none bg-transparent">
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="relative w-[90vw] h-[90vh] flex items-center justify-center">
            {/* Navigation buttons */}
            {showPrevious && (
              <button
                onClick={() => onNavigate(currentImageIndex - 1)}
                className="absolute left-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}
            {showNext && (
              <button
                onClick={() => onNavigate(currentImageIndex + 1)}
                className="absolute right-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <XIcon className="w-6 h-6" />
              <span className="sr-only">Close</span>
            </button>

            {/* Image */}
            <div className="relative w-full h-full">
              <Image
                src={images[currentImageIndex]}
                alt={alt}
                fill
                className="object-contain"
                quality={100}
                priority
              />
            </div>

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full text-white text-sm">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 
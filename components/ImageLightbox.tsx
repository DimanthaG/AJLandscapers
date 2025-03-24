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
      <DialogContent className="max-w-[100vw] max-h-[100vh] h-screen w-screen p-0 border-none bg-black/90">
        {/* Close button - Always in top right */}
        <button
          onClick={onClose}
          className="fixed top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        >
          <XIcon className="w-6 h-6" />
          <span className="sr-only">Close</span>
        </button>

        {/* Main content area with navigation */}
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Navigation buttons - Positioned on sides */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between items-center px-4 pointer-events-none">
            {showPrevious && (
              <button
                onClick={() => onNavigate(currentImageIndex - 1)}
                className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors pointer-events-auto"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
            )}
            {showNext && (
              <button
                onClick={() => onNavigate(currentImageIndex + 1)}
                className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors pointer-events-auto"
                aria-label="Next image"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            )}
          </div>

          {/* Image container */}
          <div className="w-full h-full flex items-center justify-center p-4">
            <div className="relative max-w-[90vw] max-h-[90vh]">
              <img
                src={images[currentImageIndex]}
                alt={alt}
                className="max-w-full max-h-[90vh] object-contain"
              />
            </div>
          </div>

          {/* Image counter - Centered at bottom */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full text-white text-sm">
            {currentImageIndex + 1} / {images.length}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 
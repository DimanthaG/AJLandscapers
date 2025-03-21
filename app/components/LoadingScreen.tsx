'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [shouldShow, setShouldShow] = useState(true)

  useEffect(() => {
    // Check if this is the first visit
    const hasVisited = localStorage.getItem('hasVisited')
    
    if (hasVisited) {
      setShouldShow(false)
      return
    }

    // If it's the first visit, set the flag and show loading screen
    localStorage.setItem('hasVisited', 'true')
    
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000) // 3 seconds loading time

    return () => clearTimeout(timer)
  }, [])

  if (!shouldShow) return null

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white"
        >
          <div className="text-center">
            
            <div className="w-64 h-16 relative mx-auto">
              <Image
                src="/images/logohorizontal.png"
                alt="AJ Landscapers"
                fill
                className="object-contain"
                priority
              />
            </div>
            <p className="text-gray-400 mt-4">Creating beautiful outdoor spaces...</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 
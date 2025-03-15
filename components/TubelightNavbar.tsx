'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const navItems = [
  {
    path: '/',
    name: 'Home',
  },
  {
    path: '/about',
    name: 'About',
  },
  {
    path: '/services',
    name: 'Services',
  },
  {
    path: '/gallery',
    name: 'Gallery',
  },
  {
    path: '/contact',
    name: 'Contact',
  },
]

export function TubelightNavbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <motion.nav 
        className={cn(
          "w-full bg-white transition-all duration-300",
          scrolled 
            ? "py-2 px-6 mt-2 mx-auto max-w-7xl rounded-full shadow-lg border border-gray-200" 
            : "py-4 px-8"
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className={cn(
          "flex items-center justify-between",
          !scrolled && "max-w-7xl mx-auto"
        )}>
          {/* Logo */}
          <Link 
            href="/" 
            className="text-[#a3a300] font-bold text-2xl hover:text-[#a3a300]/90 transition-colors"
          >
            AJLandscapers
          </Link>

          {/* Navigation Items */}
          <ul className="flex items-center gap-2">
            {navItems.map(({ path, name }) => {
              const isActive = pathname === path

              return (
                <li key={path}>
                  <Link
                    href={path}
                    className={cn(
                      'relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg block hover:scale-105',
                      isActive 
                        ? 'text-[#a3a300] bg-[#a3a300]/10' 
                        : 'text-gray-600 hover:text-[#a3a300] hover:bg-[#a3a300]/5'
                    )}
                  >
                    {isActive && (
                      <motion.div 
                        className="absolute inset-0 bg-[#a3a300]/10 rounded-lg z-0" 
                        layoutId="tubelight"
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                      >
                        <div className="absolute inset-0 bg-[#a3a300]/10 rounded-lg filter blur-md" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#a3a300]/20 to-transparent animate-shimmer" />
                      </motion.div>
                    )}
                    <span className="relative z-10">{name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </motion.nav>
    </div>
  )
}

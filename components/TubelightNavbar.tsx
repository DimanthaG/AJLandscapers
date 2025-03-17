'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Facebook, Instagram, Menu, X } from 'lucide-react'
import { siteConfig } from '@/config/site-config'

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
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <motion.nav 
        className={cn(
          "w-full bg-white text-white transition-all duration-300 relative",
          scrolled 
            ? "py-2 px-6 mt-2 mx-auto max-w-7xl rounded-full shadow-lg border border-[#a3a300]" 
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
            className="relative h-16 w-32 md:h-20 md:w-40 hover:opacity-90 transition-opacity -my-2"
          >
            <Image
              src="/images/logohorizontal.png"
              alt="AJ Landscapers"
              fill
              className="object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
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
                          : 'text-gray-300 hover:text-[#a3a300] hover:bg-[#a3a300]/5'
                      )}
                    >
                      {isActive && (
                        <motion.div 
                          className="absolute inset-0 bg-[#a3a300]/10 rounded-lg z-0" 
                          layoutId="tubelight"
                          transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        />
                      )}
                      <span className="relative z-10">{name}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>

            {/* Social Icons */}
            <div className="flex items-center gap-4 pl-4 border-l border-gray-600">
              {siteConfig.social.facebook && (
                <a
                  href={siteConfig.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-[#a3a300] transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {siteConfig.social.instagram && (
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-[#a3a300] transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-[#a3a300] transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "md:hidden fixed inset-x-0 bg-white shadow-lg overflow-hidden border-x border-b border-[#a3a300]",
              scrolled 
                ? "mx-auto max-w-7xl rounded-b-2xl"
                : "border-t"
            )}
          >
            <ul className="py-2">
              {navItems.map(({ path, name }) => {
                const isActive = pathname === path

                return (
                  <li key={path}>
                    <Link
                      href={path}
                      className={cn(
                        'block px-6 py-3 text-sm font-medium transition-colors',
                        isActive 
                          ? 'text-[#a3a300] bg-[#a3a300]/10' 
                          : 'text-gray-300 hover:text-[#a3a300] hover:bg-[#a3a300]/5'
                      )}
                    >
                      {name}
                    </Link>
                  </li>
                )
              })}
              
              <li className="px-6 py-3 border-t border-gray-100">
                <div className="flex items-center gap-4">
                  {siteConfig.social.facebook && (
                    <a
                      href={siteConfig.social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-[#a3a300] transition-colors"
                      aria-label="Facebook"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                  )}
                  {siteConfig.social.instagram && (
                    <a
                      href={siteConfig.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-[#a3a300] transition-colors"
                      aria-label="Instagram"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Home, Info, Wrench, Image, Phone } from "lucide-react"
import { siteConfig } from "@/config/site-config"

const navigationItems = [
  {
    name: "Home",
    href: "/",
    icon: Home
  },
  {
    name: "About",
    href: "/about",
    icon: Info
  },
  {
    name: "Services",
    href: "/services",
    icon: Wrench
  },
  {
    name: "Gallery",
    href: "/gallery",
    icon: Image
  },
  {
    name: "Contact",
    href: "/contact",
    icon: Phone
  }
]

export function TubelightNavbar() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="fixed top-0 inset-x-0 h-16 bg-gray-950/50 backdrop-blur-lg border-b border-gray-800 z-50">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-green-500">
            {siteConfig.business.name}
          </Link>
          
          <div className="hidden md:flex items-center gap-2 bg-gray-900/50 backdrop-blur px-2 py-1 rounded-full">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium rounded-full transition-colors",
                    "hover:text-green-400",
                    isActive ? "text-green-500" : "text-gray-400"
                  )}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-gray-800 rounded-full -z-10"
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30
                      }}
                    />
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <div className="bg-gray-900/90 backdrop-blur border-t border-gray-800">
          {/* Mobile Brand Bar */}
          <div className="flex items-center justify-center py-2 border-b border-gray-800/50">
            <Link href="/" className="text-lg font-bold text-green-500">
              {siteConfig.business.name}
            </Link>
          </div>
          
          {/* Mobile Navigation Items */}
          <div className="px-6 py-3">
            <div className="flex items-center justify-between">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "relative flex flex-col items-center gap-1 px-3",
                      "text-gray-400 hover:text-green-400",
                      isActive && "text-green-500"
                    )}
                  >
                    <span className="relative">
                      <Icon className="w-6 h-6" />
                      {isActive && (
                        <motion.div
                          layoutId="mobile-navbar-indicator"
                          className="absolute inset-0 bg-gray-800 rounded-full -z-10 scale-150"
                          transition={{
                            type: "spring",
                            stiffness: 350,
                            damping: 30
                          }}
                        />
                      )}
                    </span>
                    <span className="text-xs font-medium">{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

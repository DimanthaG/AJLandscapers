'use client'

import { siteConfig } from '@/config/site-config'
import { Facebook, Instagram } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-[#111111] text-gray-400 py-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-2xl font-bold text-[#a3a300] mb-6">{siteConfig.business.name}</h3>
            <p className="mb-2">{siteConfig.business.address.street}</p>
            <p className="mb-2">{siteConfig.business.address.city}, {siteConfig.business.address.province}</p>
            <p className="mb-2">{siteConfig.business.address.postalCode}</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-2">
              <p>Phone: {siteConfig.business.phone}</p>
              <p>Email: {siteConfig.business.email}</p>
            </div>
            <div className="mt-6 space-y-2">
              <h4 className="text-lg font-semibold mb-4">Business Hours</h4>
              {Object.entries(siteConfig.business.hours).map(([day, hours]) => (
                <div key={day} className="flex justify-between">
                  <span className="capitalize">{day}:</span>
                  <span>{hours}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              {siteConfig.social.facebook && (
                <a
                  href={siteConfig.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#a3a300] transition-colors p-2 rounded-full hover:bg-white/5"
                  aria-label="Follow us on Facebook"
                >
                  <Facebook className="w-6 h-6" />
                </a>
              )}
              {siteConfig.social.instagram && (
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#a3a300] transition-colors p-2 rounded-full hover:bg-white/5"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="w-6 h-6" />
                </a>
              )}
            </div>
            <div className="mt-8">
              <h4 className="text-lg font-semibold mb-4">Get in Touch</h4>
              <a
                href="/contact"
                className="inline-flex items-center px-6 py-3 text-sm font-medium text-[#111111] bg-[#a3a300] hover:bg-[#a3a300]/90 transition-all duration-300 rounded-lg"
              >
                Get Free Quote
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} {siteConfig.business.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
} 
"use client"

import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { EditableServiceCard } from "@/components/EditableServiceCard"
import { siteConfig } from "@/config/site-config"
import { useAdmin } from "@/context/admin-context"
import { v4 as uuidv4 } from 'uuid'

interface Service {
  id: string
  title: string
  description: string
  image: string
}

function generateDefaultService(): Service {
  return {
    id: uuidv4(),
    title: "New Service",
    description: "Click to edit this service description",
    image: "https://source.unsplash.com/800x600/?landscape"
  }
}

export default function ServicesPage() {
  const { isAdmin } = useAdmin()
  const [services, setServices] = useState<Service[]>(siteConfig.defaultServices)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/content?key=services')
      const data = await response.json()
      setServices(data?.content ? JSON.parse(data.content) : siteConfig.defaultServices)
    } catch (error) {
      console.error('Error fetching services:', error)
      setServices(siteConfig.defaultServices)
    } finally {
      setIsLoading(false)
    }
  }

  const saveServices = async (updatedServices: Service[]) => {
    if (!isAdmin) return

    try {
      await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: 'services',
          content: JSON.stringify(updatedServices)
        })
      })
    } catch (error) {
      console.error('Error saving services:', error)
    }
  }

  const handleAddService = () => {
    const newServices = [...services, generateDefaultService()]
    setServices(newServices)
    saveServices(newServices)
  }

  const handleDeleteService = (id: string) => {
    const newServices = services.filter(service => service.id !== id)
    setServices(newServices)
    saveServices(newServices)
  }

  const handleUpdateService = (id: string, updatedService: Partial<Service>) => {
    const newServices = services.map(service => 
      service.id === id ? { ...service, ...updatedService } : service
    )
    setServices(newServices)
    saveServices(newServices)
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#111111] pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-[#1a1a1a] rounded-lg" />
            ))}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#111111]">
      {/* Hero Section */}
      <section className="hero-section" style={{ height: '60vh', minHeight: '400px' }}>
        <div className="absolute inset-0">
          <img
            src="https://source.unsplash.com/1600x900/?landscaping,garden"
            alt="Services Hero"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Our Services</h1>
          <p className="text-xl text-gray-100 max-w-2xl mx-auto">
            Professional landscaping solutions tailored to your needs
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <EditableServiceCard
                key={service.id}
                service={service}
                onDelete={handleDeleteService}
                onUpdate={handleUpdateService}
              />
            ))}
            
            {isAdmin && (
              <button
                onClick={handleAddService}
                className="h-full min-h-[400px] flex items-center justify-center border-2 border-dashed border-primary dark:border-primary-light rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all group"
              >
                <div className="flex flex-col items-center text-primary dark:text-primary-light group-hover:text-primary-light">
                  <Plus className="h-12 w-12 mb-2" />
                  <span className="text-lg font-medium">Add New Service</span>
                </div>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-[#1a1a1a]">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Transform Your Outdoor Space?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Contact us today for a free consultation and quote. Let's bring your vision to life.
          </p>
          <a
            href="/contact"
            className="button-primary text-lg inline-block"
          >
            Get Your Free Quote
          </a>
        </div>
      </section>
    </main>
  )
}
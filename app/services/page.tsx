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
      <main className="min-h-screen bg-gray-900 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 bg-gray-800 rounded-xl" />
            ))}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-900 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-green-500 text-center mb-12">Our Services</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
              className="h-full min-h-[300px] flex items-center justify-center border-2 border-dashed border-green-500 rounded-xl hover:border-green-400 hover:bg-gray-800/50 transition-all group"
            >
              <div className="flex flex-col items-center text-green-500 group-hover:text-green-400">
                <Plus className="h-12 w-12 mb-2" />
                <span className="text-lg font-medium">Add New Service</span>
              </div>
            </button>
          )}
        </div>
      </div>
    </main>
  )
}
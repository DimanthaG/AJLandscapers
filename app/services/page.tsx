"use client"

import { useState } from "react"
import { ServicePreviewCard } from "@/components/ServicePreviewCard"

interface Service {
  id: string
  title: string
  description: string
  image: string
}

export default function ServicesPage() {
  const [services] = useState<Service[]>([
    { 
      id: "hardscape",
      title: "Breath Taking Hard Scape",
      description: "Transform your outdoor space with our expert hardscaping services.",
      image: "/images/IMG_18182.PNG"
    },
    { 
      id: "courtyard",
      title: "Elegant Court Yards",
      description: "Create your own private paradise with our custom courtyard design.",
      image: "/images/IMG_18052.PNG"
    },
    { 
      id: "entrance",
      title: "Scenic Entrances",
      description: "Make a lasting first impression with our custom entrance designs.",
      image: "/images/IMG_18132.PNG"
    },
    { 
      id: "dining",
      title: "Personal and Outdoor Dining",
      description: "Create the perfect outdoor dining and entertainment space.",
      image: "/images/IMG_1807.PNG"
    },
    { 
      id: "escape",
      title: "Cosy and Quiet Escape",
      description: "Transform your outdoor space into a peaceful retreat.",
      image: "/images/CosyQuiet.jpg"
    },
    { 
      id: "hollywood",
      title: "Hollywood Moment",
      description: "Add a touch of glamour to your outdoor space.",
      image: "/images/IMG_18032.PNG"
    },
    { 
      id: "railings",
      title: "Timeless Railings",
      description: "Enhance your property&apos;s safety and style with our custom railing solutions.",
      image: "/images/TimelessRailings.jpg"
    },
    { 
      id: "fences",
      title: "One of a Kind Garden Fences",
      description: "Define and enhance your outdoor space with our custom fence designs.",
      image: "/images/HeroImage.jpg"
    },
    { 
      id: "gates",
      title: "Majestic Columns and Gates",
      description: "Make a grand statement with our custom column and gate designs.",
      image: "/images/MajesticColumns.jpg"
    },
    { 
      id: "warranty-fences",
      title: "High Quality Life Time Warranty Fences",
      description: "Invest in peace of mind with our lifetime warranty fence solutions.",
      image: "/images/HighQualFences.jpg"
    }
  ])

  return (
    <main className="min-h-screen bg-[#111111]">
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-[#111111]">
        <div className="relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[#a3a300] mb-6">Our Services</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Professional landscaping solutions tailored to your needs
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServicePreviewCard
                key={service.id}
                title={service.title}
                image={service.image}
                id={service.id}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-[#1a1a1a]">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Outdoor Space?
          </h2>
          <p className="text-gray-300 mb-8">
            Contact us today for a free consultation and quote. Let&apos;s bring your vision to life.
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
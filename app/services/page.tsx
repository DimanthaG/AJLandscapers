import { siteConfig } from "@/config/site-config"
import { EditableContent } from "@/components/EditableContent"
import Image from "next/image"

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-gray-900 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-green-500 text-center mb-12">Our Services</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {siteConfig.services.map((service, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl bg-gray-800 p-8 hover:bg-gray-750 transition-all duration-300"
            >
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-green-400 mb-4">
                  <EditableContent
                    content={service.title}
                    id={`service-title-${index}`}
                  />
                </h3>
                <p className="text-gray-300 mb-6">
                  <EditableContent
                    content={service.description}
                    id={`service-desc-${index}`}
                  />
                </p>
                <button className="inline-flex items-center text-green-400 hover:text-green-300 transition-colors">
                  Learn more
                  <svg
                    className="ml-2 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
              <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
import { EditableContent } from "@/components/EditableContent"
import { siteConfig } from "@/config/site-config"
import Image from "next/image"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-900 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative h-[500px] rounded-lg overflow-hidden">
            <Image
              src="/about-us.jpg"
              alt="About AJLandscapers"
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-green-500">{siteConfig.about.title}</h1>
            <EditableContent
              content={siteConfig.about.description}
              id="about-description"
              className="text-gray-300 text-lg leading-relaxed"
            />
            <div className="grid grid-cols-2 gap-4 mt-8">
              {siteConfig.about.features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-800 p-4 rounded-lg border border-gray-700"
                >
                  <EditableContent
                    content={feature}
                    id={`feature-${index}`}
                    className="text-gray-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
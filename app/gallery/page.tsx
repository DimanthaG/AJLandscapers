import { GalleryGrid } from "@/components/GalleryGrid"

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-gray-900 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-green-500 text-center mb-12">Our Work</h1>
        <GalleryGrid />
        <div className="text-center mt-12">
          <p className="text-gray-300">
            These are just a few examples of our work. Contact us to see how we can transform your space.
          </p>
        </div>
      </div>
    </main>
  )
}
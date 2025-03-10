import Image from "next/image";
import { siteConfig } from "@/config/site-config";
import { EditableContent } from "@/components/EditableContent";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div className="absolute inset-0">
          <Image
            src="/hero-landscape.jpg"
            alt="Beautiful landscape"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-20 text-center text-white max-w-4xl mx-auto px-4">
          <EditableContent
            content={siteConfig.hero.title}
            id="hero-title"
            className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-600"
          />
          <EditableContent
            content={siteConfig.hero.subtitle}
            id="hero-subtitle"
            className="text-xl md:text-2xl mb-8 text-gray-300"
          />
          <a
            href="#contact"
            className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-green-500/20"
          >
            {siteConfig.hero.cta}
          </a>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-green-500">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {siteConfig.services.map((service, index) => (
              <div
                key={index}
                className="group bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/5"
              >
                <div className="h-48 relative mb-6 rounded-lg overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-green-400">
                  <EditableContent
                    content={service.title}
                    id={`service-title-${index}`}
                  />
                </h3>
                <p className="text-gray-400">
                  <EditableContent
                    content={service.description}
                    id={`service-desc-${index}`}
                  />
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-4 bg-gray-950 relative">
        <div className="absolute inset-0 bg-green-500/5" />
        <div className="max-w-4xl mx-auto relative">
          <h2 className="text-4xl font-bold text-center mb-8 text-green-500">
            <EditableContent
              content={siteConfig.about.title}
              id="about-title"
            />
          </h2>
          <p className="text-gray-300 text-center mb-12 text-lg">
            <EditableContent
              content={siteConfig.about.description}
              id="about-description"
            />
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {siteConfig.about.features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-900/50 backdrop-blur p-4 rounded-xl border border-gray-800"
              >
                <EditableContent
                  content={feature}
                  id={`feature-${index}`}
                  className="text-gray-300 text-center"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-4 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-green-500">Contact Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-6 text-green-400">Contact Information</h3>
                <div className="space-y-4 text-gray-300">
                  <p>
                    <strong className="block text-white mb-1">Address:</strong>
                    {siteConfig.business.address.street}<br />
                    {siteConfig.business.address.city}, {siteConfig.business.address.province}
                  </p>
                  <p>
                    <strong className="block text-white mb-1">Phone:</strong>
                    {siteConfig.business.phone}
                  </p>
                  <p>
                    <strong className="block text-white mb-1">Email:</strong>
                    {siteConfig.business.email}
                  </p>
                </div>
              </div>
              <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-6 text-green-400">Business Hours</h3>
                <div className="space-y-3">
                  {Object.entries(siteConfig.business.hours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between text-gray-300">
                      <span className="capitalize">{day}:</span>
                      <span>{hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <form className="bg-gray-800 p-8 rounded-xl border border-gray-700">
              <h3 className="text-xl font-semibold mb-6 text-green-400">Get a Free Quote</h3>
              <div className="space-y-6">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Your Phone"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Project Details"
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder:text-gray-500"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all hover:shadow-lg hover:shadow-green-500/20"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-green-500 mb-6">{siteConfig.business.name}</h3>
              <p className="mb-2">{siteConfig.business.address.street}</p>
              <p>{siteConfig.business.address.city}, {siteConfig.business.address.province}</p>
            </div>
            <div className="text-right">
              <div className="space-y-2">
                <p>Phone: {siteConfig.business.phone}</p>
                <p>Email: {siteConfig.business.email}</p>
              </div>
              <div className="mt-6 flex justify-end space-x-6">
                <a href={siteConfig.social.facebook} className="text-gray-400 hover:text-green-400 transition-colors">
                  Facebook
                </a>
                <a href={siteConfig.social.instagram} className="text-gray-400 hover:text-green-400 transition-colors">
                  Instagram
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} {siteConfig.business.name}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

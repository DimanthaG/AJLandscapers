import { siteConfig } from "@/config/site-config"

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-900 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-gray-800 p-8 rounded-xl">
            <h2 className="text-3xl font-bold text-green-500 mb-6">Get in Touch</h2>
            <form className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-gray-300 block">Name</label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-gray-300 block">Email</label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-gray-300 block">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-gray-300 block">Message</label>
                <textarea
                  id="message"
                  rows={6}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
          
          <div className="space-y-8">
            <div className="bg-gray-800 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-green-500 mb-4">Contact Information</h3>
              <div className="space-y-4 text-gray-300">
                <p>
                  <strong className="block text-white">Address:</strong>
                  {siteConfig.business.address.street}<br />
                  {siteConfig.business.address.city}, {siteConfig.business.address.province}
                </p>
                <p>
                  <strong className="block text-white">Phone:</strong>
                  {siteConfig.business.phone}
                </p>
                <p>
                  <strong className="block text-white">Email:</strong>
                  {siteConfig.business.email}
                </p>
              </div>
            </div>
            
            <div className="bg-gray-800 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-green-500 mb-4">Business Hours</h3>
              <div className="space-y-2 text-gray-300">
                {Object.entries(siteConfig.business.hours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between">
                    <span className="capitalize">{day}:</span>
                    <span>{hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
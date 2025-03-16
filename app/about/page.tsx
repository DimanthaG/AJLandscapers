import { EditableContent } from "@/components/EditableContent"
import { EditableImage } from "@/components/EditableImage"
import { siteConfig } from "@/config/site-config"
import Link from "next/link"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#111111]">
      {/* Hero Section */}
      <section className="hero-section" style={{ height: '60vh', minHeight: '400px' }}>
        <EditableImage
          id="about-hero"
          src="/images/Landscapers.png"
          alt="About Us Hero"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            <EditableContent
              content={siteConfig.about.title}
              id="about-title"
            />
          </h1>
          <p className="text-xl text-gray-100 max-w-2xl mx-auto">
            <EditableContent
              content="Professional landscaping services with a commitment to excellence"
              id="about-hero-subtitle"
            />
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 lg:col-span-2 text-center max-w-3xl mx-auto">
              <div className="prose prose-lg dark:prose-invert mx-auto">
                <EditableContent
                  content={siteConfig.about.description}
                  id="about-description"
                  className="text-gray-300 leading-relaxed"
                />
              </div>
              <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
                {siteConfig.about.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center space-x-3"
                  >
                    <svg className="w-6 h-6 text-[#a3a300] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
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
      </section>

      {/* Values Section */}
      <section className="section-padding bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-[#a3a300] text-center mb-12">
            <EditableContent
              content="Our Core Values"
              id="values-title"
            />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#111111] p-8 rounded-lg shadow-md border border-white/10 text-center">
              <h3 className="text-xl font-bold text-white mb-4">
                <EditableContent
                  content="Quality First"
                  id="value-1-title"
                />
              </h3>
              <p className="text-gray-300">
                <EditableContent
                  content="We take pride in delivering exceptional landscaping services that exceed expectations."
                  id="value-1-description"
                />
              </p>
            </div>
            <div className="bg-[#111111] p-8 rounded-lg shadow-md border border-white/10 text-center">
              <h3 className="text-xl font-bold text-white mb-4">
                <EditableContent
                  content="Customer Focus"
                  id="value-2-title"
                />
              </h3>
              <p className="text-gray-300">
                <EditableContent
                  content="Your satisfaction is our priority. We listen, adapt, and deliver exactly what you envision."
                  id="value-2-description"
                />
              </p>
            </div>
            <div className="bg-[#111111] p-8 rounded-lg shadow-md border border-white/10 text-center">
              <h3 className="text-xl font-bold text-white mb-4">
                <EditableContent
                  content="Sustainability"
                  id="value-3-title"
                />
              </h3>
              <p className="text-gray-300">
                <EditableContent
                  content="We implement eco-friendly practices and sustainable solutions in all our projects."
                  id="value-3-description"
                />
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-[#111111]">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            <EditableContent
              content="Ready to Transform Your Outdoor Space?"
              id="about-cta-title"
            />
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            <EditableContent
              content="Let's work together to create the landscape of your dreams."
              id="about-cta-description"
            />
          </p>
          <Link href="/contact" className="button-primary text-lg inline-block">
            Get Started Today
          </Link>
        </div>
      </section>
    </main>
  )
}
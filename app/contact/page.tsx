'use client'

import { siteConfig } from "@/config/site-config"
import { useState, FormEvent } from "react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit form');
      }

      setSubmitStatus({
        type: 'success',
        message: 'Thank you for your message! We will get back to you soon.'
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: ''
      });
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to submit form'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  return (
    <main className="min-h-screen bg-[#111111]">
      {/* Hero Section */}
      <section className="hero-section" style={{ height: '50vh', minHeight: '400px' }}>
        <div className="absolute inset-0">
          <img
            src="https://source.unsplash.com/1600x900/?garden-landscape"
            alt="Contact Hero"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Contact Us</h1>
          <p className="text-xl text-gray-100 max-w-2xl mx-auto">
            Let's discuss your landscaping vision
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-[#1a1a1a] p-8 rounded-lg shadow-md border border-white/10">
                <h2 className="text-3xl font-bold text-white mb-8">Get in Touch</h2>
                {submitStatus.type && (
                  <div className={`p-4 rounded-lg mb-6 ${
                    submitStatus.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                  }`}>
                    {submitStatus.message}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="text-gray-300 block mb-2">Name</label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#111111] border border-white/10 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-white"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="text-gray-300 block mb-2">Email</label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#111111] border border-white/10 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-white"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="phone" className="text-gray-300 block mb-2">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#111111] border border-white/10 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-white"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="service" className="text-gray-300 block mb-2">Service Interest</label>
                    <select
                      id="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#111111] border border-white/10 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-white"
                    >
                      <option value="">Select a service</option>
                      {siteConfig.defaultServices.map((service, index) => (
                        <option key={index} value={service.title}>{service.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="message" className="text-gray-300 block mb-2">Message</label>
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="w-full px-4 py-3 bg-[#111111] border border-white/10 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-white"
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`button-primary w-full py-4 text-lg ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-[#1a1a1a] p-8 rounded-lg shadow-md border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
                <div className="space-y-6 text-gray-300">
                  <div>
                    <strong className="block text-white mb-2">Address</strong>
                    <p>
                      {siteConfig.business.address.street}<br />
                      {siteConfig.business.address.city}, {siteConfig.business.address.province}
                    </p>
                  </div>
                  <div>
                    <strong className="block text-white mb-2">Phone</strong>
                    <p>{siteConfig.business.phone}</p>
                  </div>
                  <div>
                    <strong className="block text-white mb-2">Email</strong>
                    <p>{siteConfig.business.email}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#1a1a1a] p-8 rounded-lg shadow-md border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-6">Business Hours</h3>
                <div className="space-y-3 text-gray-300">
                  {Object.entries(siteConfig.business.hours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between">
                      <span className="capitalize font-medium">{day}</span>
                      <span>{hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Media Links */}
              <div className="bg-[#1a1a1a] p-8 rounded-lg shadow-md border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-6">Connect With Us</h3>
                <div className="space-y-4">
                  {Object.entries(siteConfig.social).map(([platform, url]) => (
                    url && (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-300 hover:text-primary-light transition-colors"
                      >
                        <span className="capitalize">{platform}</span>
                      </a>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
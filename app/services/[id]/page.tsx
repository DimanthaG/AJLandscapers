"use client"

import { EditableContent } from "@/components/EditableContent";
import { EditableImage } from "@/components/EditableImage";
import { ImageLightbox } from "@/components/ImageLightbox";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

const serviceDetails = {
  hardscape: {
    title: "Breath Taking Hard Scape",
    description: `Transform your outdoor space with our expert hardscaping services. We specialize in creating stunning patios, walkways, retaining walls, and outdoor living spaces that combine functionality with aesthetic appeal.

Our experienced team uses high-quality materials and innovative design techniques to bring your vision to life. Whether you're looking to create an elegant outdoor entertaining area or enhance your property's curb appeal, our hardscaping solutions are tailored to your specific needs.`,
    features: [
      "Custom patio design and installation",
      "Natural stone and paver walkways",
      "Retaining walls and garden borders",
      "Outdoor kitchens and fireplaces",
      "Water features and fountains",
      "LED landscape lighting"
    ],
    images: [
      "/images/IMG_18182.PNG",
      "/images/IMG_18052.PNG",
      "/images/IMG_18132.PNG"
    ],
    benefits: [
      "Increases property value",
      "Reduces maintenance requirements",
      "Creates functional outdoor living spaces",
      "Improves drainage and prevents erosion",
      "Enhances curb appeal"
    ]
  },
  courtyard: {
    title: "Elegant Court Yards",
    description: `Create your own private paradise with our custom courtyard design and installation services. Our courtyards combine the beauty of nature with sophisticated architectural elements to create intimate outdoor spaces perfect for relaxation and entertainment.

We carefully consider factors like privacy, lighting, and flow to design courtyards that serve as natural extensions of your home. From Mediterranean-inspired retreats to modern minimalist spaces, we can create a courtyard that matches your style and needs.`,
    features: [
      "Custom courtyard design",
      "Privacy landscaping",
      "Water features and fountains",
      "Outdoor seating areas",
      "Decorative paving",
      "Ambient lighting design"
    ],
    images: [
      "/images/IMG_18052.PNG",
      "/images/IMG_18182.PNG",
      "/images/IMG_1807.PNG"
    ],
    benefits: [
      "Creates private outdoor living space",
      "Adds value to your property",
      "Provides perfect entertainment area",
      "Reduces noise pollution",
      "Improves energy efficiency"
    ]
  },
  entrance: {
    title: "Scenic Entrances",
    description: `Make a lasting first impression with our custom entrance and driveway design services. We create grand, welcoming approaches to your property that combine beauty with functionality.

Our designs incorporate elegant landscaping, strategic lighting, and premium materials to create entrances that enhance your property's curb appeal while providing safe and convenient access.`,
    features: [
      "Custom driveway design",
      "Decorative gates and fencing",
      "Landscape lighting",
      "Stone and paver installation",
      "Security features",
      "Seasonal planting design"
    ],
    images: [
      "/services/scenic/1.jpg",
      "/services/scenic/2.jpg",
      "/services/scenic/3.jpg",
      "/services/scenic/4.jpg",
      "/services/scenic/5.jpg"
    ],
    benefits: [
      "Enhances curb appeal",
      "Improves property value",
      "Creates welcoming atmosphere",
      "Increases security",
      "Reduces maintenance needs"
    ]
  },
  dining: {
    title: "Personal and Outdoor Dining",
    description: `Create the perfect outdoor dining and entertainment space with our custom design services. We specialize in crafting beautiful, functional areas that seamlessly blend indoor comfort with outdoor beauty.

Our designs incorporate weather-resistant materials, proper lighting, and thoughtful layouts to ensure your outdoor dining space is both practical and stunning. From intimate family dining areas to grand entertainment spaces, we create environments that inspire memorable gatherings.`,
    features: [
      "Custom outdoor kitchen design",
      "Weather-resistant dining areas",
      "Pergolas and shade structures",
      "Built-in grilling stations",
      "Ambient lighting systems",
      "All-weather furniture selection"
    ],
    images: [
      "/images/IMG_1807.PNG",
      "/images/IMG_18052.PNG",
      "/images/IMG_18132.PNG"
    ],
    benefits: [
      "Extends your living space",
      "Perfect for entertaining",
      "Increases property value",
      "Creates lasting memories",
      "Year-round outdoor enjoyment"
    ]
  },
  escape: {
    title: "Cosy and Quiet Escape",
    description: `Transform your outdoor space into a peaceful retreat with our custom escape design services. We create serene environments that provide a perfect balance of privacy, comfort, and natural beauty.

Our designs focus on creating intimate spaces that feel secluded from the outside world, incorporating elements like water features, comfortable seating, and strategic plantings to create your personal sanctuary.`,
    features: [
      "Private garden design",
      "Meditation spaces",
      "Water features and fountains",
      "Comfortable seating areas",
      "Privacy landscaping",
      "Mood lighting design"
    ],
    images: [
      "/images/CosyQuiet.jpg",
      "/images/IMG_18032.PNG",
      "/images/IMG_1807.PNG"
    ],
    benefits: [
      "Creates personal sanctuary",
      "Reduces stress",
      "Improves mental wellbeing",
      "Increases property value",
      "Perfect for relaxation"
    ]
  },
  hollywood: {
    title: "Hollywood Moment",
    description: `Add a touch of glamour to your outdoor space with our Hollywood-inspired design services. We create sophisticated, dramatic landscapes that make every moment feel like a red carpet event.

Our designs incorporate luxurious materials, dramatic lighting, and eye-catching features to create spaces that exude elegance and style. From grand entrances to stunning pool areas, we bring the magic of Hollywood to your home.`,
    features: [
      "Dramatic lighting design",
      "Luxury material selection",
      "Statement water features",
      "Grand entrance design",
      "Premium landscaping",
      "Elegant outdoor furniture"
    ],
    images: [
      "/images/IMG_18032.PNG",
      "/images/CosyQuiet.jpg",
      "/images/IMG_1807.PNG"
    ],
    benefits: [
      "Creates wow factor",
      "Perfect for entertaining",
      "Increases property value",
      "Enhances curb appeal",
      "Makes lasting impression"
    ]
  },
  railings: {
    title: "Timeless Railings",
    description: `Enhance your property's safety and style with our custom railing solutions. We design and install beautiful, durable railings that complement your architecture while providing essential security.

Our expert team works with premium materials and innovative designs to create railings that are both functional and aesthetically pleasing. Whether you need deck railings, stair railings, or decorative barriers, we ensure every installation meets the highest standards of quality and design.`,
    features: [
      "Custom railing design",
      "Premium material options",
      "Professional installation",
      "Safety compliance",
      "Decorative elements",
      "Low maintenance solutions"
    ],
    images: [
      "/services/railings/1.jpg",
      "/services/railings/2.jpg",
      "/services/railings/3.jpg",
      "/services/railings/4.jpg",
      "/services/railings/5.jpg",
      "/services/railings/6.jpg"
    ],
    benefits: [
      "Enhances safety",
      "Adds architectural interest",
      "Increases property value",
      "Low maintenance",
      "Long-lasting durability"
    ]
  },
  fences: {
    title: "One of a Kind Garden Fences",
    description: `Define and enhance your outdoor space with our custom fence designs. We create unique, beautiful fencing solutions that provide privacy and security while adding character to your landscape.

Our expert team combines functionality with artistic design to create fences that become a stunning feature of your property. Using high-quality materials and expert craftsmanship, we ensure your fence is both beautiful and built to last. As shown in our featured design, we can create stunning decorative metal fences with artistic patterns that cast beautiful shadows when backlit, combined with professional landscaping using natural stone and carefully selected plants.`,
    features: [
      "Custom fence design",
      "Premium material selection",
      "Professional installation",
      "Decorative elements",
      "Privacy solutions",
      "Security features",
      "Artistic pattern design",
      "Integrated lighting solutions"
    ],
    images: [
      "/services/fences/1.jpg",
      "/services/fences/2.jpg",
      "/services/fences/3.jpg",
      "/services/fences/4.jpg",
      "/services/fences/5.jpg"
    ],
    benefits: [
      "Enhances privacy",
      "Increases security",
      "Adds property value",
      "Creates stunning visual effects",
      "Low maintenance",
      "Unique artistic expression"
    ]
  },
  gates: {
    title: "Majestic Columns and Gates",
    description: `Make a grand statement with our custom column and gate designs. We create impressive entrances that combine security with sophisticated style, setting the tone for your entire property.

Our designs range from classic to contemporary, incorporating premium materials and expert craftsmanship to create gates and columns that stand the test of time. Whether you're looking for automated security gates or decorative garden entrances, we deliver solutions that exceed expectations.`,
    features: [
      "Custom gate design",
      "Column construction",
      "Automated systems",
      "Security integration",
      "Lighting design",
      "Premium materials"
    ],
    images: [
      "/images/HighQualFences.jpg",
      "/images/MajesticColumns.jpg",
      "/images/HeroImage.jpg"
    ],
    benefits: [
      "Enhances security",
      "Creates grand entrance",
      "Increases property value",
      "Improves curb appeal",
      "Adds sophistication"
    ]
  },
  "warranty-fences": {
    title: "High Quality Life Time Warranty Fences",
    description: `Invest in peace of mind with our lifetime warranty fence solutions. We offer premium fencing options backed by comprehensive warranties, ensuring your investment is protected for years to come.

Our high-quality fences are built using the finest materials and installed by expert craftsmen, providing durability, security, and beauty that lasts. Each installation comes with our lifetime warranty, giving you confidence in your investment.`,
    features: [
      "Lifetime warranty coverage",
      "Premium material selection",
      "Expert installation",
      "Multiple style options",
      "Security features",
      "Low maintenance design"
    ],
    images: [
      "/images/IMG_18032.PNG",
      "/images/CosyQuiet.jpg",
      "/images/IMG_1807.PNG"
    ],
    benefits: [
      "Lifetime protection",
      "Peace of mind",
      "Increased property value",
      "Low maintenance",
      "Long-term reliability"
    ]
  }
};

export default function ServicePage({ params }: { params: { id: string } }) {
  const service = serviceDetails[params.id as keyof typeof serviceDetails] || serviceDetails.hardscape;
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleNavigate = (newIndex: number) => {
    setSelectedImageIndex(newIndex);
  };

  return (
    <main className="min-h-screen bg-[#111111] text-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px]">
        <EditableImage
          id={`service-hero-${params.id}`}
          src={service.images[0]}
          alt={service.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <Link 
              href="/services"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Services
            </Link>
            <h1 className="text-5xl font-bold text-white mb-6">
              <EditableContent
                content={service.title}
                id={`service-title-${params.id}`}
              />
            </h1>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <div className="prose prose-lg prose-invert">
                <EditableContent
                  content={service.description}
                  id={`service-description-${params.id}`}
                />
              </div>

              {/* Image Gallery */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {service.images.map((image, index) => (
                  <div 
                    key={index} 
                    className="relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => handleImageClick(index)}
                  >
                    <EditableImage
                      id={`service-gallery-${params.id}-${index}`}
                      src={image}
                      alt={`${service.title} - Image ${index + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>

              {/* Image Lightbox */}
              <ImageLightbox
                isOpen={selectedImageIndex !== null}
                onClose={() => setSelectedImageIndex(null)}
                images={service.images}
                currentImageIndex={selectedImageIndex || 0}
                onNavigate={handleNavigate}
                alt={service.title}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Features */}
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Features</h3>
                <ul className="space-y-3">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-[#a3a300] flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">
                        <EditableContent
                          content={feature}
                          id={`service-feature-${params.id}-${index}`}
                        />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits */}
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Benefits</h3>
                <ul className="space-y-3">
                  {service.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-[#a3a300] flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">
                        <EditableContent
                          content={benefit}
                          id={`service-benefit-${params.id}-${index}`}
                        />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="bg-[#a3a300] rounded-lg p-6 text-center">
                <h3 className="text-xl font-semibold text-black mb-4">Ready to Transform Your Space?</h3>
                <Link
                  href="/contact"
                  className="inline-block w-full py-3 px-6 bg-black text-white rounded-lg hover:bg-black/90 transition-colors"
                >
                  Get a Free Quote
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 
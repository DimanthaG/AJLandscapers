'use client';

import { EditableContent } from './EditableContent';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface ServicePreviewCardProps {
  title: string;
  image: string;
  id: string;
  index: number;
}

export function ServicePreviewCard({ title, image, id, index }: ServicePreviewCardProps) {
  return (
    <div className="relative w-full h-full aspect-[3/5] rounded-2xl overflow-hidden group">
      {/* Background Image */}
      <div className="absolute inset-0 bg-black">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black via-black/70 to-transparent">
        <h3 className="text-2xl font-bold text-white mb-2">
          <EditableContent
            content={title}
            id={`service-preview-title-${index}`}
          />
        </h3>
        
        <div className="bg-red-600 -mx-6 px-6 py-1 mb-4">
          <p className="text-white text-sm font-bold text-center">Landscape With Style For Less</p>
        </div>
        
        <Link
          href={`/services/${id}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-[#111111] bg-[#a3a300] hover:bg-[#a3a300]/90 transition-all duration-300 rounded-lg"
        >
          View Details
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
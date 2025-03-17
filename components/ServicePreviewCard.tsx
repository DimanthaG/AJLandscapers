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
  // Function to split title and add line breaks, keeping certain phrases together
  const formatTitle = (title: string) => {
    // Replace spaces with newlines, but keep specific phrases together
    return title
      .replace('Hard Scape', 'Hardscape')
      .replace('Outdoor Dining', 'OutdoorDining')
      .replace('Quiet Escape', 'QuietEscape')
      .replace('Majestic Columns', 'MajesticColumns')
      .replace('High Quality', 'HighQuality')
      .replace('Life Time', 'LifeTime')
      .replace('Warranty Fences', 'WarrantyFences')
      .replace('One of a Kind', 'OneOfAKind')
      .replace('Garden Fences', 'GardenFences')
      .replace('and Gates', 'andGates')
      .split(' ')
      .map(word => 
        word
          .replace('Hardscape', 'Hard Scape')
          .replace('OutdoorDining', 'Outdoor Dining')
          .replace('QuietEscape', 'Quiet Escape')
          .replace('MajesticColumns', 'Majestic Columns')
          .replace('HighQuality', 'High Quality')
          .replace('LifeTime', 'Life Time')
          .replace('WarrantyFences', 'Warranty Fences')
          .replace('OneOfAKind', 'One of a Kind')
          .replace('GardenFences', 'Garden Fences')
          .replace('andGates', 'and Gates')
      )
      .join('\n');
  };

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
      <div className="absolute inset-0" />

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black via-black/70 to-transparent">
        <h3 className="text-3xl font-bold text-white mb-2 text-left whitespace-pre-line leading-tight">
          <EditableContent
            content={formatTitle(title)}
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
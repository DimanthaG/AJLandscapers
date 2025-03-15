import { useState } from 'react'
import { useAdmin } from '@/context/admin-context'
import { Pencil, Trash2, Check, X } from 'lucide-react'
import { EditableImage } from './EditableImage'
import Link from 'next/link'

interface Service {
  id: string
  title: string
  description: string
  image: string
}

interface EditableServiceCardProps {
  service: Service
  onDelete: (id: string) => void
  onUpdate: (id: string, updatedService: Partial<Service>) => void
}

export function EditableServiceCard({ service, onDelete, onUpdate }: EditableServiceCardProps) {
  const { isAdmin } = useAdmin()
  const [isEditing, setIsEditing] = useState(false)
  const [editedService, setEditedService] = useState(service)
  const [isHovered, setIsHovered] = useState(false)

  const handleUpdate = () => {
    onUpdate(service.id, editedService)
    setIsEditing(false)
  }

  const handleImageUpdate = (newSrc: string) => {
    setEditedService(prev => ({
      ...prev,
      image: newSrc
    }))
  }

  if (isEditing && isAdmin) {
    return (
      <div className="bg-[#1a1a1a] rounded-lg shadow-lg border border-[#a3a300]/30 p-6">
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
            <input
              type="text"
              value={editedService.title}
              onChange={(e) => setEditedService(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 bg-[#111111] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea
              value={editedService.description}
              onChange={(e) => setEditedService(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 bg-[#111111] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary resize-none h-32"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Image</label>
            <EditableImage
              id={`service-${service.id}`}
              src={editedService.image}
              alt={editedService.title}
              className="w-full h-48 object-cover rounded-lg"
              onUpdate={handleImageUpdate}
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-sm font-medium text-[#111111] bg-[#a3a300] hover:bg-[#a3a300]/90 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="px-4 py-2 text-sm font-medium text-[#111111] bg-[#a3a300] hover:bg-[#a3a300]/90 rounded-lg transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="relative bg-[#1a1a1a] rounded-lg shadow-lg border border-white/10 overflow-hidden group hover:border-[#a3a300]/30"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-w-16 aspect-h-9 relative">
        <EditableImage
          id={`service-${service.id}`}
          src={service.image}
          alt={service.title}
          fill
          className="object-cover rounded-t-lg"
        />
        {isAdmin && isHovered && (
          <div className="absolute top-2 right-2 flex gap-2 z-20">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 bg-[#a3a300] rounded-full hover:bg-[#a3a300]/90 transition-colors"
            >
              <Pencil className="h-4 w-4 text-[#111111]" />
            </button>
            <button
              onClick={() => onDelete(service.id)}
              className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
            >
              <Trash2 className="h-4 w-4 text-white" />
            </button>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-[#a3a300] mb-4">
          {service.title}
        </h3>
        <p className="text-[#a3a300]/90 mb-6 line-clamp-3">
          {service.description}
        </p>
        <Link
          href={`/services#${service.id}`}
          className="inline-flex items-center text-[#a3a300] hover:text-[#a3a300]/90 transition-colors font-medium"
        >
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
        </Link>
      </div>
    </div>
  )
}
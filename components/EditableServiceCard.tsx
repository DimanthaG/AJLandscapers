import { useState } from 'react'
import { useAdmin } from '@/context/admin-context'
import { Pencil, Trash2, Check, X } from 'lucide-react'
import { EditableImage } from './EditableImage'

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
      <div className="relative p-6 bg-gray-800 rounded-xl border-2 border-green-500">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
            <input
              type="text"
              value={editedService.title}
              onChange={(e) => setEditedService(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea
              value={editedService.description}
              onChange={(e) => setEditedService(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white resize-none h-24"
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
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Check className="h-5 w-5" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="group relative overflow-hidden rounded-xl bg-gray-800 p-8 hover:bg-gray-750 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative z-10">
        <h3 className="text-2xl font-bold text-green-400 mb-4">
          {service.title}
        </h3>
        <p className="text-gray-300 mb-6">
          {service.description}
        </p>
        <button className="inline-flex items-center text-green-400 hover:text-green-300 transition-colors">
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
        </button>
      </div>

      <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
        <EditableImage
          id={`service-${service.id}`}
          src={service.image}
          alt={service.title}
          fill
          className="object-cover"
        />
      </div>

      {isAdmin && isHovered && (
        <div className="absolute top-2 right-2 flex gap-2 z-20">
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 bg-green-500 rounded-full hover:bg-green-600 transition-colors"
          >
            <Pencil className="h-4 w-4 text-white" />
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
  )
}
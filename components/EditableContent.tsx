"use client"

import { useState, useEffect } from 'react'
import { useAdmin } from '@/context/admin-context'
import { Pencil } from 'lucide-react'

interface EditableContentProps {
  content: string
  id: string
  className?: string
}

export function EditableContent({ content, id, className = "" }: EditableContentProps) {
  const { isAdmin } = useAdmin()
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(content)
  const [isHovered, setIsHovered] = useState(false)
  
  useEffect(() => {
    const savedContent = localStorage.getItem(`content-${id}`)
    if (savedContent) {
      setEditedContent(savedContent)
    }
  }, [id])

  const handleSave = () => {
    localStorage.setItem(`content-${id}`, editedContent)
    setIsEditing(false)
  }

  if (!isAdmin) {
    return <div className={className}>{editedContent}</div>
  }

  if (isEditing) {
    return (
      <div className="relative bg-gray-800/50 p-4 rounded-lg border border-green-500/50">
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="w-full p-2 bg-gray-800 text-white border border-green-500 rounded resize-y min-h-[100px]"
        />
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Save Changes
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={`${className} ${isHovered ? 'ring-2 ring-green-500/50 rounded-lg' : ''}`}
        onClick={() => setIsEditing(true)}
      >
        {editedContent}
      </div>
      {isHovered && (
        <div className="absolute -right-12 top-1/2 -translate-y-1/2 bg-green-500 text-white p-2 rounded-full shadow-lg cursor-pointer">
          <Pencil className="h-4 w-4" />
        </div>
      )}
    </div>
  )
}
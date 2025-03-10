"use client"

import { useState, useEffect } from 'react'
import { useAdmin } from '@/context/admin-context'
import { Pencil } from 'lucide-react'

interface EditableContentProps {
  content: string
  id: string
  className?: string
}

export function EditableContent({ content: initialContent, id, className = "" }: EditableContentProps) {
  const { isAdmin } = useAdmin()
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(initialContent)
  const [isHovered, setIsHovered] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  useEffect(() => {
    // Fetch initial content from the API
    const fetchContent = async () => {
      try {
        const response = await fetch(`/api/content?key=${id}`)
        const data = await response.json()
        if (data?.content) {
          setEditedContent(data.content)
        }
      } catch (error) {
        console.error('Error fetching content:', error)
      }
    }

    fetchContent()
  }, [id])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: id,
          content: editedContent
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save content')
      }

      setIsEditing(false)
    } catch (error) {
      console.error('Error saving content:', error)
      // Optionally show an error message to the user
    } finally {
      setIsSaving(false)
    }
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
          disabled={isSaving}
        />
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors ${
              isSaving ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            onClick={() => setIsEditing(false)}
            disabled={isSaving}
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
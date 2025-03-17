"use client"

import { useState, useEffect, useRef } from 'react'
import { useAdmin } from '@/context/admin-context'
import { Pencil } from 'lucide-react'
import { getContentCache, setContentCache } from '@/lib/contentCache'
import { makeEditable } from '@/utils/editMode'

interface EditableContentProps {
  content: string
  id: string
  className?: string
  as?: keyof JSX.IntrinsicElements
}

export const EditableContent = ({ content: initialContent, id, className = "", as: Tag = "div" }: EditableContentProps) => {
  const { isAdmin } = useAdmin()
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(() => getContentCache(id) || initialContent)
  const [isHovered, setIsHovered] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const elementRef = useRef<HTMLElement>(null)
  
  useEffect(() => {
    // Only fetch from API if we don't have it in cache
    if (!getContentCache(id)) {
      const fetchContent = async () => {
        try {
          const response = await fetch(`/api/content?key=${id}`)
          const data = await response.json()
          if (data?.content) {
            setEditedContent(data.content)
            setContentCache(id, data.content)
          }
        } catch (error) {
        }
      }
      fetchContent()
    }
  }, [id])

  useEffect(() => {
    if (elementRef.current) {
      makeEditable(elementRef.current, id, editedContent)
    }
  }, [editedContent, id])

  const handleSave = async () => {
    setIsSaving(true)
    // Optimistically update the cache
    setContentCache(id, editedContent)
    
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
      // On error, revert the cache to the previous value
      setContentCache(id, initialContent)
      setEditedContent(initialContent)
      // Optionally show an error message to the user
    } finally {
      setIsSaving(false)
    }
  }

  if (!isAdmin) {
    return <Tag ref={elementRef} className={className}>{editedContent}</Tag>
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
      <Tag 
        ref={elementRef}
        className={`${className} ${isHovered ? 'ring-2 ring-green-500/50 rounded-lg' : ''}`}
        onClick={() => setIsEditing(true)}
      >
        {editedContent}
      </Tag>
      {isHovered && (
        <div className="absolute -right-12 top-1/2 -translate-y-1/2 bg-green-500 text-white p-2 rounded-full shadow-lg cursor-pointer">
          <Pencil className="h-4 w-4" />
        </div>
      )}
    </div>
  )
}
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, ArrowLeft, Upload, X } from 'lucide-react'
import { siteConfig } from '@/config/site-config'

type EditModalProps = {
  isOpen: boolean
  onClose: () => void
  title: string
  type: 'text' | 'image' | 'richtext'
  currentValue: string
  onSave: (value: string) => void
}

const EditModal = ({ isOpen, onClose, title, type, currentValue, onSave }: EditModalProps) => {
  const [value, setValue] = useState(currentValue)
  const [isUploading, setIsUploading] = useState(false)

  const handleImageUpload = async (file: File) => {
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'your_cloudinary_upload_preset') // You'll need to set this

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/your_cloud_name/image/upload`, // You'll need to set this
        {
          method: 'POST',
          body: formData,
        }
      )

      const data = await response.json()
      setValue(data.secure_url)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-[#1a1a1a] rounded-lg p-6 max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {type === 'image' ? (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-white/10 rounded-lg p-4">
              {value && (
                <img src={value} alt="Preview" className="max-h-48 mx-auto mb-4" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary-light text-white rounded-lg transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                {isUploading ? 'Uploading...' : 'Upload Image'}
              </label>
            </div>
          </div>
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-3 py-2 bg-[#111111] text-white border border-white/10 rounded-lg"
          />
        )}
        
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(value)
              onClose()
            }}
            disabled={isUploading}
            className="px-4 py-2 bg-primary hover:bg-primary-light text-white rounded-lg transition-colors disabled:opacity-50"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default function EditModePage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editedContent, setEditedContent] = useState(siteConfig)
  const [previewScale, setPreviewScale] = useState(0.7)
  const [editModal, setEditModal] = useState<{
    isOpen: boolean
    title: string
    type: 'text' | 'image' | 'richtext'
    key: string
    value: string
  }>({
    isOpen: false,
    title: '',
    type: 'text',
    key: '',
    value: ''
  })

  useEffect(() => {
    // Check authentication on mount
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check')
        if (!response.ok) {
          router.replace('/login')
          return
        }
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Auth check error:', error)
        router.replace('/login')
      }
    }

    checkAuth()
  }, [router])

  const handleContentChange = (key: string, value: string) => {
    setEditedContent(prev => ({
      ...prev,
      [key.split('.')[0]]: {
        ...prev[key.split('.')[0]],
        [key.split('.')[1]]: value
      }
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Save each edited content field
      const savePromises = Object.entries(editedContent).flatMap(([section, content]) =>
        Object.entries(content).map(([key, value]) =>
          fetch('/api/content', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              key: `${section}.${key}`,
              content: value
            }),
          })
        )
      )

      await Promise.all(savePromises)
      alert('Changes saved successfully!')
    } catch (error) {
      console.error('Error saving changes:', error)
      alert('Failed to save changes')
    } finally {
      setIsSaving(false)
    }
  }

  const handleElementClick = (event: MessageEvent) => {
    if (event.data.type === 'elementClick') {
      const { elementId, currentValue, elementType } = event.data
      setEditModal({
        isOpen: true,
        title: `Edit ${elementId}`,
        type: elementType || 'text',
        key: elementId,
        value: currentValue
      })
    }
  }

  useEffect(() => {
    window.addEventListener('message', handleElementClick)
    return () => window.removeEventListener('message', handleElementClick)
  }, [])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#111111]">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-[#1a1a1a] border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 text-white hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </button>
            <span className="text-white font-medium">Edit Mode</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="scale" className="text-white text-sm">
                Preview Scale:
              </label>
              <input
                id="scale"
                type="range"
                min="0.5"
                max="1"
                step="0.1"
                value={previewScale}
                onChange={(e) => setPreviewScale(parseFloat(e.target.value))}
                className="w-32"
              />
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-light text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-16">
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Website Preview */}
          <div className="w-3/5 bg-white border-r border-white/10 overflow-hidden">
            <div 
              style={{ 
                transform: `scale(${previewScale})`,
                transformOrigin: 'top center',
                height: `${100 / previewScale}%`,
                overflow: 'auto'
              }}
              className="bg-white"
            >
              <iframe
                src="/"
                className="w-full h-full border-0"
                style={{ 
                  height: '100vh',
                  pointerEvents: 'auto' // Enable clicking
                }}
              />
            </div>
          </div>

          {/* Editable Content Sections */}
          <div className="w-2/5 bg-[#1a1a1a] overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Edit Content</h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label htmlFor="scale" className="text-white text-sm whitespace-nowrap">
                      Preview Scale:
                    </label>
                    <input
                      id="scale"
                      type="range"
                      min="0.5"
                      max="1"
                      step="0.1"
                      value={previewScale}
                      onChange={(e) => setPreviewScale(parseFloat(e.target.value))}
                      className="w-24"
                    />
                  </div>
                </div>
              </div>
              
              {/* Hero Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Hero Section</h3>
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={editedContent.hero.title}
                      onChange={(e) => handleContentChange('hero.title', e.target.value)}
                      className="w-full px-3 py-2 bg-[#111111] text-white border border-white/10 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      value={editedContent.hero.subtitle}
                      onChange={(e) => handleContentChange('hero.subtitle', e.target.value)}
                      className="w-full px-3 py-2 bg-[#111111] text-white border border-white/10 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      CTA Text
                    </label>
                    <input
                      type="text"
                      value={editedContent.hero.cta}
                      onChange={(e) => handleContentChange('hero.cta', e.target.value)}
                      className="w-full px-3 py-2 bg-[#111111] text-white border border-white/10 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">About Section</h3>
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={editedContent.about.title}
                      onChange={(e) => handleContentChange('about.title', e.target.value)}
                      className="w-full px-3 py-2 bg-[#111111] text-white border border-white/10 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Description
                    </label>
                    <textarea
                      value={editedContent.about.description}
                      onChange={(e) => handleContentChange('about.description', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 bg-[#111111] text-white border border-white/10 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Features</h3>
                <div className="grid gap-4">
                  {editedContent.about.features.map((feature, index) => (
                    <div key={index}>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Feature {index + 1}
                      </label>
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => {
                          const newFeatures = [...editedContent.about.features]
                          newFeatures[index] = e.target.value
                          setEditedContent(prev => ({
                            ...prev,
                            about: {
                              ...prev.about,
                              features: newFeatures
                            }
                          }))
                        }}
                        className="w-full px-3 py-2 bg-[#111111] text-white border border-white/10 rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal(prev => ({ ...prev, isOpen: false }))}
        title={editModal.title}
        type={editModal.type}
        currentValue={editModal.value}
        onSave={(value) => handleContentChange(editModal.key, value)}
      />
    </div>
  )
} 
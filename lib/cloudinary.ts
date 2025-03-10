const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`

// Create a dedicated unsigned upload preset in your Cloudinary dashboard
// Go to Settings > Upload > Upload presets > Add upload preset
// Set "Signing Mode" to "Unsigned"
// Name it "ajlandscaper_uploads"
const UPLOAD_PRESET = 'ml_default'

export async function uploadToCloudinary(
  file: File | Blob,
  options: {
    folder?: string;
    resourceType?: 'image' | 'video';
    transformation?: string;
  } = {}
): Promise<{ secure_url: string; public_id: string; bytes: number }> {
  const { folder = 'gallery', resourceType = 'image', transformation = 'q_auto,f_auto' } = options

  try {
    // Create form data for unsigned upload
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', UPLOAD_PRESET)
    formData.append('folder', folder)
    formData.append('transformation', transformation)
    
    // Log upload attempt
    console.log('Starting Cloudinary upload...', {
      type: resourceType,
      preset: UPLOAD_PRESET,
      folder: folder
    })

    // Upload to Cloudinary using unsigned upload
    const response = await fetch(`${CLOUDINARY_URL}/${resourceType}/upload`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Cloudinary upload error response:', errorData)
      throw new Error(`Cloudinary upload failed: ${errorData.error?.message || response.statusText}`)
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw new Error(`Failed to upload to Cloudinary: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    // For deletion, we'll use the serverless function approach
    // This is more secure than client-side deletion
    const response = await fetch(`/api/cloudinary-delete?public_id=${encodeURIComponent(publicId)}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Failed to delete from Cloudinary: ${errorData.error || 'Unknown error'}`)
    }
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error)
    throw error
  }
}

export function getOptimizedUrl(publicId: string, options: {
  width?: number;
  height?: number;
  quality?: string;
  format?: 'auto' | 'webp' | 'jpg';
  resourceType?: 'image' | 'video';
} = {}): string {
  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    resourceType = 'image'
  } = options

  const transformations = [
    'c_limit', // Limit mode (preserves aspect ratio)
    'q_' + quality,
    'f_' + format,
    width && 'w_' + width,
    height && 'h_' + height
  ].filter(Boolean).join(',')

  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload/${transformations}/${publicId}`
}
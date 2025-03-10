const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`

export async function uploadToCloudinary(
  file: File | Blob,
  options: {
    folder?: string;
    resourceType?: 'image' | 'video';
  } = {}
): Promise<{ 
  secure_url: string; 
  public_id: string; 
  bytes: number;
  format: string;
}> {
  const { folder = 'gallery', resourceType = 'image' } = options

  try {
    // Basic upload parameters
    const params = {
      folder,
      timestamp: Math.round(new Date().getTime() / 1000).toString()
    }

    // Generate signature first
    const signature = await generateSignature(params)

    // Create form data with all parameters
    const formData = new FormData()
    formData.append('file', file)
    formData.append('api_key', process.env.CLOUDINARY_API_KEY!)
    formData.append('signature', signature)
    
    // Add all params to form data
    Object.entries(params).forEach(([key, value]) => {
      formData.append(key, value)
    })
    
    console.log('Starting Cloudinary upload...', {
      type: resourceType,
      folder: folder,
      timestamp: params.timestamp
    })

    // Upload to Cloudinary using signed upload
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

async function generateSignature(params: Record<string, string>): Promise<string> {
  // Sort parameters alphabetically and create string to sign
  const stringToSign = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('&') + process.env.CLOUDINARY_API_SECRET

  // Use Web Crypto API for SHA-1 hashing
  const encoder = new TextEncoder()
  const data = encoder.encode(stringToSign)
  const hashBuffer = await crypto.subtle.digest('SHA-1', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  
  return hashHex
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
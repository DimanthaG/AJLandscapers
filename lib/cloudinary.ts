const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`

export async function uploadToCloudinary(
  file: File | Blob,
  options: {
    folder?: string;
    resourceType?: 'image' | 'video';
    transformation?: string;
  } = {}
): Promise<{ secure_url: string; public_id: string; bytes: number }> {
  const { folder = 'gallery', resourceType = 'image', transformation = 'q_auto,f_auto' } = options

  // Create upload signature
  const timestamp = Math.round(new Date().getTime() / 1000)
  const signature = await generateSignature(timestamp, {
    folder,
    transformation
  })

  // Create form data
  const formData = new FormData()
  formData.append('file', file)
  formData.append('api_key', process.env.CLOUDINARY_API_KEY!)
  formData.append('timestamp', timestamp.toString())
  formData.append('signature', signature)
  formData.append('folder', folder)
  formData.append('transformation', transformation)

  // Upload to Cloudinary
  const response = await fetch(`${CLOUDINARY_URL}/${resourceType}/upload`, {
    method: 'POST',
    body: formData
  })

  if (!response.ok) {
    throw new Error('Failed to upload to Cloudinary')
  }

  return response.json()
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  const timestamp = Math.round(new Date().getTime() / 1000)
  const signature = await generateSignature(timestamp, {
    public_id: publicId
  })

  const formData = new FormData()
  formData.append('public_id', publicId)
  formData.append('api_key', process.env.CLOUDINARY_API_KEY!)
  formData.append('timestamp', timestamp.toString())
  formData.append('signature', signature)

  const response = await fetch(`${CLOUDINARY_URL}/destroy`, {
    method: 'POST',
    body: formData
  })

  if (!response.ok) {
    throw new Error('Failed to delete from Cloudinary')
  }
}

export function getOptimizedUrl(publicId: string, options: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'jpg';
  resourceType?: 'image' | 'video';
} = {}) {
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

async function generateSignature(
  timestamp: number, 
  params: Record<string, string | number>
): Promise<string> {
  const entries = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('&')

  const stringToSign = `${entries}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`
  
  const encoder = new TextEncoder()
  const data = encoder.encode(stringToSign)
  const hashBuffer = await crypto.subtle.digest('SHA-1', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  
  return hashHex
}
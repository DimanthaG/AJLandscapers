import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

export function getCloudinaryImageUrl(publicId: string, options: {
  width?: number;
  height?: number;
  quality?: number;
} = {}) {
  const { width, height, quality = 'auto' } = options;
  
  return cloudinary.url(publicId, {
    width,
    height,
    quality,
    fetch_format: 'auto',
    crop: 'fill',
    gravity: 'auto',
  });
}

export function getCloudinaryVideoUrl(publicId: string, options: {
  width?: number;
  height?: number;
  quality?: number;
} = {}) {
  const { width, height, quality = 'auto' } = options;
  
  return cloudinary.url(publicId, {
    resource_type: 'video',
    width,
    height,
    quality,
    fetch_format: 'auto',
    crop: 'fill',
    gravity: 'auto',
  });
}

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

  // Create form data
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'ml_default') // Create an unsigned upload preset in your Cloudinary dashboard
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
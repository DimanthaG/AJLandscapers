export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
  uploadPreset: 'ajlandscaper_preset',
  folder: 'gallery',
  allowedFormats: ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm'],
  maxFileSize: {
    image: 10 * 1024 * 1024, // 10MB
    video: 50 * 1024 * 1024, // 50MB
  },
  transformations: {
    image: 'q_auto,f_auto,w_1280,c_limit',
    video: 'q_auto,f_auto,w_854',
  },
}

export function validateCloudinaryConfig() {
  const requiredVars = [
    'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
  ]

  const missing = requiredVars.filter(
    (varName) => !process.env[varName]
  )

  if (missing.length > 0) {
    throw new Error(
      `Missing required Cloudinary environment variables: ${missing.join(', ')}`
    )
  }
}
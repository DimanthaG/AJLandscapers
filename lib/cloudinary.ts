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
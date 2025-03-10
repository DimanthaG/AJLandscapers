import imageCompression from 'browser-image-compression';

export async function compressImage(file: File) {
  const options = {
    maxSizeMB: 0.3, // Reduced from 1MB to 300KB
    maxWidthOrHeight: 1280, // Reduced from 1920 to 1280px
    useWebWorker: true,
    initialQuality: 0.6, // Reduced from 0.8 to 0.6
    alwaysKeepResolution: false, // Allow resolution reduction
    maxIteration: 10, // Increase compression iterations
    exifOrientation: -1, // Strip EXIF data to save space
  };

  try {
    // Try to compress with initial settings
    let compressedFile = await imageCompression(file, options);
    const size = compressedFile.size / (1024 * 1024); // Size in MB

    // If still too large, try more aggressive compression
    if (size > 0.3) {
      options.initialQuality = 0.4;
      options.maxWidthOrHeight = 1024;
      compressedFile = await imageCompression(file, options);
    }

    return compressedFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    return file;
  }
}

export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src); // Clean up
      resolve({
        width: img.width,
        height: img.height
      });
    };
    img.src = URL.createObjectURL(file);
  });
}
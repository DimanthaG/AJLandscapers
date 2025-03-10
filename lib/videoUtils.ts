interface VideoCompressionOptions {
  targetSize?: number; // Target size in MB
  maxBitrate?: number; // Max bitrate in bps
  maxWidth?: number; // Max width in pixels
}

export async function compressVideo(
  file: File, 
  options: VideoCompressionOptions = {}
): Promise<{ blob: Blob; duration: number }> {
  const {
    targetSize = 5, // Default target size 5MB
    maxBitrate = 800000, // 800Kbps
    maxWidth = 854 // 480p equivalent
  } = options;

  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.src = URL.createObjectURL(file)
    
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src)
      const duration = video.duration
      
      // Calculate target bitrate based on desired file size
      const targetBitrate = Math.min(
        maxBitrate,
        (targetSize * 8 * 1024 * 1024) / duration
      )
      
      // Scale dimensions while maintaining aspect ratio
      const scale = Math.min(1, maxWidth / video.videoWidth)
      const scaledWidth = Math.floor(video.videoWidth * scale)
      const scaledHeight = Math.floor(video.videoHeight * scale)
      
      const canvas = document.createElement('canvas')
      canvas.width = scaledWidth
      canvas.height = scaledHeight
      const ctx = canvas.getContext('2d')
      const stream = canvas.captureStream()
      
      // Configure video compression with calculated settings
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: targetBitrate
      })
      
      const chunks: Blob[] = []
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' })
        resolve({ blob, duration })
      }
      
      // Process video frames with scaled dimensions
      video.currentTime = 0
      video.play()
      mediaRecorder.start(1000) // Capture in 1-second chunks
      
      video.ontimeupdate = () => {
        if (ctx) {
          ctx.drawImage(video, 0, 0, scaledWidth, scaledHeight)
        }
        
        if (video.currentTime >= video.duration) {
          video.pause()
          mediaRecorder.stop()
        }
      }
    }
    
    video.onerror = () => reject(new Error('Error loading video'))
  })
}
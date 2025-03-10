import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabase } from '@/lib/supabase'
import cloudinary from '@/lib/cloudinary'

// Size limits are now handled by Cloudinary's automatic optimization
export async function GET() {
  const { data: media, error } = await supabase
    .from('gallery')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(media)
}

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const adminToken = cookieStore.get('admin-token')

  if (!adminToken || adminToken.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { src, alt, width, height, type } = await request.json()

    if (!src || !alt) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 })
    }

    if (src.startsWith('data:')) {
      // Upload to Cloudinary with automatic optimization
      const uploadResponse = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'gallery',
            resource_type: type === 'video' ? 'video' : 'image',
            quality: 'auto', // Automatic quality optimization
            fetch_format: 'auto', // Automatic format optimization
            transformation: [
              type === 'video' 
                ? { width: 854, crop: 'scale', quality: 'auto' }
                : { width: 1280, crop: 'limit', quality: 'auto' }
            ]
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        )

        // Convert base64 to buffer and upload
        const base64Data = src.split(',')[1]
        const buffer = Buffer.from(base64Data, 'base64')
        uploadStream.end(buffer)
      })

      // Save reference in Supabase
      const { data: savedMedia, error: dbError } = await supabase
        .from('gallery')
        .insert({
          src: uploadResponse.secure_url,
          alt,
          width: uploadResponse.width,
          height: uploadResponse.height,
          type,
          cloudinary_id: uploadResponse.public_id,
          size: uploadResponse.bytes / (1024 * 1024) // Convert to MB
        })
        .select()
        .single()

      if (dbError) {
        throw dbError
      }

      return NextResponse.json(savedMedia)
    }

    return NextResponse.json({ error: 'Invalid image data' }, { status: 400 })

  } catch (error) {
    console.error('Error processing media:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json({ 
      error: 'Failed to process media',
      details: errorMessage 
    }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const cookieStore = await cookies()
  const adminToken = cookieStore.get('admin-token')

  if (!adminToken || adminToken.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const cloudinaryId = searchParams.get('cloudinary_id')

  if (!cloudinaryId) {
    return NextResponse.json({ error: 'Cloudinary ID is required' }, { status: 400 })
  }

  try {
    // Delete from Cloudinary
    await cloudinary.uploader.destroy(cloudinaryId)

    // Delete from Supabase
    const { error: dbError } = await supabase
      .from('gallery')
      .delete()
      .eq('cloudinary_id', cloudinaryId)

    if (dbError) {
      throw dbError
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json({ 
      error: 'Failed to delete media',
      details: errorMessage 
    }, { status: 500 })
  }
}
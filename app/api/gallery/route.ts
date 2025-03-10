import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabase } from '@/lib/supabase'
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary'

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
    const { src, alt, type } = await request.json()

    if (!src || !alt) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 })
    }

    if (src.startsWith('data:')) {
      // Convert base64 to Blob
      const base64Data = src.split(',')[1]
      const contentType = src.split(';')[0].split(':')[1]
      const byteCharacters = atob(base64Data)
      const byteNumbers = new Uint8Array(byteCharacters.length)
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      
      const blob = new Blob([byteNumbers], { type: contentType })

      // Upload to Cloudinary with automatic optimization
      const uploadResult = await uploadToCloudinary(blob, {
        resourceType: type,
        transformation: type === 'video' 
          ? 'q_auto,f_auto,w_854' 
          : 'q_auto,f_auto,w_1280,c_limit'
      })

      // Save reference in Supabase
      const { data: savedMedia, error: dbError } = await supabase
        .from('gallery')
        .insert({
          src: uploadResult.secure_url,
          alt,
          width: type === 'video' ? 854 : 1280,
          height: type === 'video' ? 480 : 720, // Approximate height based on aspect ratio
          type,
          cloudinary_id: uploadResult.public_id,
          size: uploadResult.bytes / (1024 * 1024) // Convert to MB
        })
        .select()
        .single()

      if (dbError) {
        throw dbError
      }

      return NextResponse.json(savedMedia)
    }

    return NextResponse.json({ error: 'Invalid media data' }, { status: 400 })

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
    await deleteFromCloudinary(cloudinaryId)

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
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import { uploadToCloudinary } from '@/lib/cloudinary'

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

      console.log('Starting upload process...', {
        type,
        contentType,
        blobSize: blob.size,
      })

      try {
        // Upload to Cloudinary
        const uploadResult = await uploadToCloudinary(blob, {
          resourceType: type,
        })

        console.log('Upload successful:', {
          url: uploadResult.secure_url,
          size: uploadResult.bytes,
          format: uploadResult.format,
          id: uploadResult.public_id
        })

        // Save reference in Supabase using admin client
        const { data: savedMedia, error: dbError } = await supabaseAdmin
          .from('gallery')
          .insert({
            src: uploadResult.secure_url,
            alt,
            width: type === 'video' ? 854 : 1280,
            height: type === 'video' ? 480 : 720,
            type,
            size: uploadResult.bytes / (1024 * 1024) // Convert to MB
          })
          .select()
          .single()

        if (dbError) {
          throw new Error(`Database error: ${dbError.message}`)
        }

        return NextResponse.json({
          ...savedMedia,
          format: uploadResult.format,
          public_id: uploadResult.public_id
        })
      } catch (uploadError) {
        console.error('Upload error details:', uploadError)
        throw new Error(`Upload failed: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}`)
      }
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
  const mediaUrl = searchParams.get('src')

  if (!mediaUrl) {
    return NextResponse.json({ error: 'Media URL is required' }, { status: 400 })
  }

  try {
    // Delete from Supabase using admin client
    const { error: dbError } = await supabaseAdmin
      .from('gallery')
      .delete()
      .eq('src', mediaUrl)

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
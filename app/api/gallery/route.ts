import { v2 as cloudinary } from 'cloudinary'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '../../../utils/jwt'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function GET() {
  try {
    // Verify authentication
    const cookieStore = await cookies()
    const token = await cookieStore.get('auth_token')

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyToken(token.value)
    
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch data from both tables
    const result = await cloudinary.search
      .expression('resource_type:image OR resource_type:video AND folder:gallery')
      .sort_by('created_at', 'desc')
      .max_results(100)
      .execute()

    return NextResponse.json(result.resources)
  } catch (error) {
    console.error('API Route - Error details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch media' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { publicId } = await request.json()

    if (!publicId) {
      return NextResponse.json({ error: 'Public ID is required' }, { status: 400 })
    }

    const result = await cloudinary.uploader.destroy(publicId)

    if (result.result === 'ok') {
      return NextResponse.json({ message: 'Image deleted successfully' })
    } else {
      return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 })
    }
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error)
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 })
  }
}
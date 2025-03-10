import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function DELETE(request: Request) {
  const cookieStore = await cookies()
  const adminToken = cookieStore.get('admin-token')

  if (!adminToken || adminToken.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const publicId = searchParams.get('public_id')

  if (!publicId) {
    return NextResponse.json({ error: 'Public ID is required' }, { status: 400 })
  }

  try {
    const timestamp = Math.round(new Date().getTime() / 1000).toString()
    const params = {
      public_id: publicId,
      timestamp
    }
    
    const signature = await generateSignature(params)

    const formData = new FormData()
    formData.append('api_key', process.env.CLOUDINARY_API_KEY!)
    formData.append('signature', signature)
    Object.entries(params).forEach(([key, value]) => {
      formData.append(key, value)
    })

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/destroy`, 
      {
        method: 'POST',
        body: formData
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to delete from Cloudinary')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error)
    return NextResponse.json({ 
      error: 'Failed to delete from Cloudinary',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

async function generateSignature(params: Record<string, string>): Promise<string> {
  const stringToSign = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('&') + process.env.CLOUDINARY_API_SECRET
  
  const encoder = new TextEncoder()
  const data = encoder.encode(stringToSign)
  const hashBuffer = await crypto.subtle.digest('SHA-1', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  
  return hashHex
}
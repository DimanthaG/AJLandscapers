import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// Use environment variables for security
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'AJLandscapers2024!'

export async function POST(request: Request) {
  const { username, password } = await request.json()

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const cookieStore = cookies()
    cookieStore.set('admin-token', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 hours
    })

    return NextResponse.json({ success: true })
  }

  return NextResponse.json(
    { success: false, message: 'Invalid credentials' },
    { status: 401 }
  )
}

export async function GET() {
  const cookieStore = cookies()
  const token = cookieStore.get('admin-token')
  
  return NextResponse.json({ 
    isAuthenticated: token?.value === 'authenticated'
  })
}

export async function DELETE() {
  const cookieStore = cookies()
  cookieStore.delete('admin-token')
  
  return NextResponse.json({ success: true })
}
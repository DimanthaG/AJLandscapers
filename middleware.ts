import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/app/utils/jwt'

// Add paths that require authentication
const protectedPaths = ['/dashboard']

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Only check authentication for protected paths
  if (!protectedPaths.includes(path)) {
    return NextResponse.next()
  }

  const token = request.cookies.get('auth_token')?.value

  if (!token) {
    console.log('No auth token found, redirecting to login')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    const payload = await verifyToken(token)
    
    if (!payload || payload.role !== 'admin') {
      console.log('Invalid role in token, redirecting to login')
      return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.log('Token verification failed:', error)
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/dashboard/:path*']
}
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Verify authentication for admin-only API routes
export function middleware(request: NextRequest) {
  const adminToken = request.cookies.get('admin-token')
  const isApiRoute = request.nextUrl.pathname.startsWith('/api/')
  const isAuthRoute = request.nextUrl.pathname.startsWith('/api/auth')
  
  // Don't protect the auth route itself
  if (isAuthRoute) {
    return NextResponse.next()
  }

  // Protect admin API routes
  if (isApiRoute && request.nextUrl.pathname.includes('/admin')) {
    if (!adminToken || adminToken.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  return NextResponse.next()
}
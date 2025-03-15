import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '../../../utils/jwt'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

console.log('API Route - Supabase URL:', supabaseUrl)
console.log('API Route - Service Key exists:', !!supabaseServiceKey)

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET() {
  try {
    console.log('API Route - Starting GET request')
    
    // Verify authentication
    const cookieStore = await cookies()
    const token = await cookieStore.get('auth_token')
    console.log('API Route - Auth token exists:', !!token)

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyToken(token.value)
    console.log('API Route - JWT payload:', payload)
    
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch data from both tables
    console.log('API Route - Fetching data from Supabase')
    
    // Test Supabase connection first
    const { data: testData, error: testError } = await supabase
      .from('quote_requests')
      .select('count')
    
    console.log('API Route - Test query result:', { testData, testError })

    const [quoteResult, contactResult] = await Promise.all([
      supabase
        .from('quote_requests')
        .select('*')
        .order('created_at', { ascending: false }),
      supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false })
    ])

    console.log('API Route - Quote result:', {
      data: quoteResult.data,
      error: quoteResult.error
    })
    console.log('API Route - Contact result:', {
      data: contactResult.data,
      error: contactResult.error
    })

    if (quoteResult.error) throw quoteResult.error
    if (contactResult.error) throw contactResult.error

    const response = {
      quotes: quoteResult.data || [],
      contacts: contactResult.data || []
    }
    
    console.log('API Route - Sending response:', response)
    return NextResponse.json(response)
  } catch (error) {
    console.error('API Route - Error details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    )
  }
} 
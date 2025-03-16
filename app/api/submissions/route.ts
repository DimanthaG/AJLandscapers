import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '../../../utils/jwt'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

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

    if (quoteResult.error) throw quoteResult.error
    if (contactResult.error) throw contactResult.error

    const response = {
      quotes: quoteResult.data || [],
      contacts: contactResult.data || []
    }
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('API Route - Error details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    )
  }
} 
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET() {
  try {
    // Create quote_requests table
    const { error: quoteError } = await supabase.rpc('create_quote_requests_if_not_exists', {
      sql: `
        CREATE TABLE IF NOT EXISTS quote_requests (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT,
          service TEXT,
          message TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
          status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived'))
        );
      `
    })

    if (quoteError) throw quoteError

    // Create contact_submissions table
    const { error: contactError } = await supabase.rpc('create_contact_submissions_if_not_exists', {
      sql: `
        CREATE TABLE IF NOT EXISTS contact_submissions (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          message TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
          status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived'))
        );
      `
    })

    if (contactError) throw contactError

    return NextResponse.json({ message: 'Tables created successfully' })
  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json(
      { error: 'Failed to create tables' },
      { status: 500 }
    )
  }
} 
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .limit(1)

    if (error) throw error

    return NextResponse.json({ 
      status: 'Connected successfully!',
      test_query: data 
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json({ 
      status: 'Connection failed', 
      error: errorMessage 
    }, { status: 500 })
  }
}
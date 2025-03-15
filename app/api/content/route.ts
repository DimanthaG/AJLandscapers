import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { siteConfig } from '@/config/site-config'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    if (!key) {
      return NextResponse.json(
        { error: 'Missing key parameter' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('content')
      .select('content')
      .eq('key', key)
      .single()

    if (error) throw error

    return NextResponse.json({ content: data?.content })
  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    )
  }
}

function getDefaultContent(key: string): string {
  const defaults: Record<string, string> = {
    'hero-title': 'Transform Your Outdoor Space',
    'hero-subtitle': 'Professional Landscaping Services in Western Mass',
    'hero-cta': 'Get Started Today',
    'image-hero': '/images/HeroImage.jpg',
    // Add more default content as needed
  }

  return defaults[key] || ''
}

export async function POST(request: Request) {
  try {
    const { key, content } = await request.json()

    if (!key || content === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('content')
      .upsert({ key, content, updated_at: new Date().toISOString() })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating content:', error)
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    )
  }
}
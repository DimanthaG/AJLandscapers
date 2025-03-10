import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import { siteConfig } from '@/config/site-config'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const key = searchParams.get('key')

  if (!key) {
    return NextResponse.json({ error: 'Key is required' }, { status: 400 })
  }

  try {
    // Try to fetch from database
    const { data, error: dbError } = await supabase
      .from('content')
      .select('content')
      .eq('key', key)
      .single()

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`)
    }

    // If content exists in database, return it
    if (data?.content) {
      return NextResponse.json(data)
    }

    // If not in database, get default content from site config
    const defaultContent = getDefaultContent(key)
    if (defaultContent) {
      // Store default content in database
      await supabaseAdmin
        .from('content')
        .upsert({ key, content: defaultContent })

      return NextResponse.json({ content: defaultContent })
    }

    // If no default content found, return 404
    return NextResponse.json({ error: 'Content not found' }, { status: 404 })
  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch content',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

function getDefaultContent(key: string): string | undefined {
  // Parse the key to understand what content is being requested
  if (key.startsWith('hero-')) {
    const subKey = key.replace('hero-', '') as keyof typeof siteConfig.hero
    return siteConfig.hero[subKey]
  }
  
  if (key.startsWith('service-title-')) {
    const index = parseInt(key.replace('service-title-', ''))
    return siteConfig.defaultServices[index]?.title
  }
  
  if (key.startsWith('service-desc-')) {
    const index = parseInt(key.replace('service-desc-', ''))
    return siteConfig.defaultServices[index]?.description
  }
  
  if (key.startsWith('about-')) {
    const subKey = key.replace('about-', '') as keyof typeof siteConfig.about
    const content = siteConfig.about[subKey]
    return typeof content === 'string' ? content : undefined
  }
  
  if (key.startsWith('feature-')) {
    const index = parseInt(key.replace('feature-', ''))
    return siteConfig.about.features[index]
  }

  return undefined
}

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const adminToken = cookieStore.get('admin-token')

  if (!adminToken || adminToken.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { key, content } = await request.json()

  if (!key || !content) {
    return NextResponse.json({ error: 'Key and content are required' }, { status: 400 })
  }

  // Use admin client for write operations
  const { error: upsertError } = await supabaseAdmin
    .from('content')
    .upsert({ key, content })

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
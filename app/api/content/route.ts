import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const key = searchParams.get('key')

  if (!key) {
    return NextResponse.json({ error: 'Key is required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('content')
    .select('content')
    .eq('key', key)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
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

  const { error: upsertError } = await supabase
    .from('content')
    .upsert({ key, content })

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

type RouteParams = { params: { id: string } };

export async function PATCH(request: NextRequest, context: RouteParams) {
  try {
    const { type, status } = await request.json();
    const supabase = createClient();
    
    const table = type === 'quote' ? 'quote_requests' : 'contact_submissions';
    
    const { data, error } = await supabase
      .from(table)
      .update({ status })
      .eq('id', context.params.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating submission:', error);
    return NextResponse.json(
      { error: 'Failed to update submission' },
      { status: 500 }
    );
  }
} 
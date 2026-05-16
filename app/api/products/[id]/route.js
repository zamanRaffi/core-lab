import { supabaseAdmin } from '../../../../lib/supabase-admin'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  const { id } = params

  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*, categories(id, name, icon)')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'প্রোডাক্ট পাওয়া যায়নি' }, { status: 404 })
  }

  return NextResponse.json(data)
}

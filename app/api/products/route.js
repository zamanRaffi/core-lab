import { supabaseAdmin } from '../../../lib/supabase-admin'
import { NextResponse } from 'next/server'

// GET 
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const admin = searchParams.get('admin') === 'true'
  const category = searchParams.get('category')

  if (admin) {
    const auth = request.headers.get('x-admin-password')
    if (auth !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  let query = supabaseAdmin
    .from('products')
    .select('*, categories(id, name, icon)')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (!admin) query = query.eq('is_active', true)
  if (category && category !== 'all') query = query.eq('category_id', category)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST
export async function POST(request) {
  const auth = request.headers.get('x-admin-password')
  if (auth !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { data, error } = await supabaseAdmin
    .from('products')
    .insert([{
      name: body.name,
      description: body.description,
      price: body.price,
      old_price: body.old_price || null,
      category_id: body.category_id || null,
      sizes: body.sizes || ['S', 'M', 'L', 'XL', 'XXL'],
      badge: body.badge || null,
      image_url: body.image_url || null,
      whatsapp_message: body.whatsapp_message || body.name + ' অর্ডার করতে চাই',
      is_active: body.is_active ?? true,
      sort_order: body.sort_order || 0,
      details: body.details || null,      
      materials: body.materials || null,
      care: body.care || null,   
    }])
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

// PATCH 
export async function PATCH(request) {
  const auth = request.headers.get('x-admin-password')
  if (auth !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { id, ...updates } = body

  const { data, error } = await supabaseAdmin
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// DELETE
export async function DELETE(request) {
  const auth = request.headers.get('x-admin-password')
  if (auth !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  const { error } = await supabaseAdmin.from('products').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

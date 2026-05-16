import { NextResponse } from 'next/server'

export async function POST(request) {
  const { password } = await request.json()
  const expected = process.env.ADMIN_PASSWORD

  if (!expected) {
    return NextResponse.json(
      { error: 'ADMIN_PASSWORD is not configured in .env.local' },
      { status: 500 }
    )
  }

  if (password !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({ ok: true })
}

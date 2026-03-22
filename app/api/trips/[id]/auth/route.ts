import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { verifyPassword } from '@/lib/auth'

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const { password } = await req.json()
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('trips')
    .select('password')
    .eq('id', id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
  }

  const valid = await verifyPassword(password, data.password)
  if (!valid) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  return NextResponse.json({ success: true })
}

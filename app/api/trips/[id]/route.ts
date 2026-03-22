import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('trips')
    .select('id, title, start_date, end_date, budget_cny, created_at')
    .eq('id', id)
    .single()

  if (error) return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
  return NextResponse.json(data)
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const body = await req.json()
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('trips')
    .update({
      ...(body.title !== undefined && { title: body.title }),
      ...(body.start_date !== undefined && { start_date: body.start_date }),
      ...(body.end_date !== undefined && { end_date: body.end_date }),
      ...(body.budget_cny !== undefined && { budget_cny: body.budget_cny }),
    })
    .eq('id', id)
    .select('id, title, start_date, end_date, budget_cny, created_at')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

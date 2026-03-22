import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const supabase = createServerClient()

  // Delete child records first, then the trip
  await supabase.from('schedule_items').delete().eq('trip_id', id)
  await supabase.from('checklist_items').delete().eq('trip_id', id)
  await supabase.from('expenses').delete().eq('trip_id', id)
  await supabase.from('photos').delete().eq('trip_id', id)
  await supabase.from('places').delete().eq('trip_id', id)

  const { error } = await supabase.from('trips').delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}

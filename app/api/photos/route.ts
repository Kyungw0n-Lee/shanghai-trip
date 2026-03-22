import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  const refId = req.nextUrl.searchParams.get('ref_id')
  if (!refId) return NextResponse.json({ error: 'ref_id required' }, { status: 400 })
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('ref_id', refId)
    .order('created_at')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File
  const tripId = formData.get('trip_id') as string
  const refType = formData.get('ref_type') as string
  const refId = formData.get('ref_id') as string
  const caption = formData.get('caption') as string | null

  if (!file || !tripId || !refType || !refId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const supabase = createServerClient()
  const fileName = `${tripId}/${refType}/${refId}/${Date.now()}-${file.name}`
  const arrayBuffer = await file.arrayBuffer()

  const { error: uploadError } = await supabase.storage
    .from('trip-photos')
    .upload(fileName, arrayBuffer, { contentType: file.type })

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 })

  const { data: urlData } = supabase.storage.from('trip-photos').getPublicUrl(fileName)

  const { data, error } = await supabase
    .from('photos')
    .insert({ trip_id: tripId, ref_type: refType, ref_id: refId, storage_url: urlData.publicUrl, caption })
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

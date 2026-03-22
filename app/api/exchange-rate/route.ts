import { NextResponse } from 'next/server'
import { fetchCnyKrwRate } from '@/lib/exchange-rate'

export async function GET() {
  try {
    const rate = await fetchCnyKrwRate()
    return NextResponse.json({ rate })
  } catch {
    return NextResponse.json({ rate: 190 })
  }
}

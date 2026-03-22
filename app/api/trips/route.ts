import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { hashPassword } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { title, start_date, end_date, password } = body

  if (!title || !start_date || !end_date || !password) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const supabase = createServerClient()
  const hashed = await hashPassword(password)

  const { data, error } = await supabase
    .from('trips')
    .insert({ title, start_date, end_date, password: hashed })
    .select('id, title, start_date, end_date, budget_cny, created_at')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await seedChecklistTemplate(supabase, data.id)

  return NextResponse.json(data, { status: 201 })
}

async function seedChecklistTemplate(supabase: ReturnType<typeof createServerClient>, tripId: string) {
  const templates = [
    { category: '여권/비자', items: ['여권 유효기간 6개월 이상 확인', '한국인 무비자 입국 가능 여부 확인 (15일)'] },
    { category: '앱 준비', items: ['위챗(WeChat) 설치 및 계정 생성', '알리페이(Alipay) 설치 및 외국인 인증', 'VPN 앱 설치 (출국 전 반드시 설치)'] },
    { category: '환전', items: ['위안화(CNY) 환전 또는 알리페이 충전', '소액 현금 준비 (일부 소규모 가게 현금만 가능)'] },
    { category: '짐 준비', items: ['여행용 어댑터 (중국 220V, A/I 타입)', '상하이 날씨에 맞는 의류', '상비약 준비'] },
    { category: '예약', items: ['항공권 예약 확인', '숙소 예약 확인', '주요 레스토랑/관광지 사전 예약'] },
  ]

  let sortOrder = 0
  const rows = templates.flatMap(({ category, items }) =>
    items.map(content => ({
      trip_id: tripId,
      category,
      content,
      is_checked: false,
      is_template: true,
      sort_order: sortOrder++,
    }))
  )

  await supabase.from('checklist_items').insert(rows)
}

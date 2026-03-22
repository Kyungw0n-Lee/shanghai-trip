export interface Trip {
  id: string
  title: string
  start_date: string
  end_date: string
  budget_cny: number
  created_at: string
}

export interface ScheduleItem {
  id: string
  trip_id: string
  day_index: number
  sort_order: number
  time: string | null
  title: string
  memo: string | null
  is_reserved: boolean
  cost: number
  place_id: string | null
}

export interface ChecklistItem {
  id: string
  trip_id: string
  category: string
  content: string
  is_checked: boolean
  is_template: boolean
  sort_order: number
}

export interface Expense {
  id: string
  trip_id: string
  date: string
  category: ExpenseCategory
  amount_cny: number
  memo: string | null
}

export interface Place {
  id: string
  trip_id: string
  name: string
  address: string | null
  lat: number | null
  lng: number | null
  tag: PlaceTag
  memo: string | null
  google_place_id: string | null
}

export interface Photo {
  id: string
  trip_id: string
  ref_type: 'place' | 'schedule_item' | 'checklist_item'
  ref_id: string
  storage_url: string
  caption: string | null
}

export type ExpenseCategory = '식비' | '교통' | '숙박' | '쇼핑' | '기타'
export type PlaceTag = '관광지' | '맛집' | '카페' | '쇼핑'

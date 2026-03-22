'use client'

import { useState } from 'react'
import { ScheduleItem } from '@/types'

interface Props {
  tripId: string
  dayIndex: number
  onSave: (item: ScheduleItem) => void
  onCancel: () => void
  initial?: Partial<ScheduleItem>
}

export default function ScheduleItemForm({ tripId, dayIndex, onSave, onCancel, initial }: Props) {
  const [form, setForm] = useState({
    title: initial?.title ?? '',
    time: initial?.time ?? '',
    memo: initial?.memo ?? '',
    is_reserved: initial?.is_reserved ?? false,
    cost: initial?.cost ?? 0,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const url = initial?.id ? `/api/schedule-items/${initial.id}` : '/api/schedule-items'
    const method = initial?.id ? 'PATCH' : 'POST'
    const body = initial?.id ? form : { ...form, trip_id: tripId, day_index: dayIndex, sort_order: 0 }

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) return
    const data = await res.json()
    onSave(data)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-4 space-y-3">
      <input
        type="text"
        placeholder="일정 이름"
        value={form.title}
        onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
        className="w-full border rounded-lg px-3 py-2 text-sm"
        required
      />
      <div className="grid grid-cols-2 gap-2">
        <input
          type="time"
          value={form.time}
          onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
          className="border rounded-lg px-3 py-2 text-sm"
        />
        <input
          type="number"
          placeholder="비용 (CNY)"
          value={form.cost}
          onChange={e => setForm(f => ({ ...f, cost: Number(e.target.value) }))}
          className="border rounded-lg px-3 py-2 text-sm"
          min="0"
        />
      </div>
      <textarea
        placeholder="메모"
        value={form.memo}
        onChange={e => setForm(f => ({ ...f, memo: e.target.value }))}
        className="w-full border rounded-lg px-3 py-2 text-sm resize-none"
        rows={2}
      />
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.is_reserved}
          onChange={e => setForm(f => ({ ...f, is_reserved: e.target.checked }))}
        />
        예약 완료
      </label>
      <div className="flex gap-2">
        <button type="button" onClick={onCancel} className="flex-1 border rounded-lg py-2 text-sm text-gray-600">취소</button>
        <button type="submit" className="flex-1 bg-blue-500 text-white rounded-lg py-2 text-sm">저장</button>
      </div>
    </form>
  )
}

'use client'

import { useState } from 'react'
import { ScheduleItem } from '@/types'
import ScheduleItemForm from './ScheduleItemForm'

interface Props {
  item: ScheduleItem
  canEdit: boolean
  onUpdate: (item: ScheduleItem) => void
  onDelete: (id: string) => void
}

export default function ScheduleItemCard({ item, canEdit, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState(false)

  async function handleDelete() {
    if (!confirm('삭제하시겠습니까?')) return
    const res = await fetch(`/api/schedule-items/${item.id}`, { method: 'DELETE' })
    if (!res.ok) return
    onDelete(item.id)
  }

  if (editing) {
    return (
      <ScheduleItemForm
        tripId={item.trip_id}
        dayIndex={item.day_index}
        initial={item}
        onSave={updated => { onUpdate(updated); setEditing(false) }}
        onCancel={() => setEditing(false)}
      />
    )
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {item.time && <span className="text-xs text-gray-400">{item.time}</span>}
            {item.is_reserved && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">예약완료</span>
            )}
          </div>
          <p className="font-medium">{item.title}</p>
          {item.memo && <p className="text-sm text-gray-500 mt-1">{item.memo}</p>}
          {item.cost > 0 && <p className="text-sm text-blue-500 mt-1">¥{item.cost}</p>}
        </div>
        {canEdit && (
          <div className="flex gap-1 ml-2">
            <button onClick={() => setEditing(true)} className="text-gray-400 hover:text-gray-600 text-sm p-1">수정</button>
            <button onClick={handleDelete} className="text-red-400 hover:text-red-600 text-sm p-1">삭제</button>
          </div>
        )}
      </div>
    </div>
  )
}

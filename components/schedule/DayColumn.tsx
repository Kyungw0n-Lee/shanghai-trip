'use client'

import { useState } from 'react'
import { ScheduleItem } from '@/types'
import ScheduleItemCard from './ScheduleItemCard'
import ScheduleItemForm from './ScheduleItemForm'

interface Props {
  tripId: string
  dayIndex: number
  date: string
  items: ScheduleItem[]
  canEdit: boolean
  onUpdate: (item: ScheduleItem) => void
  onAdd: (item: ScheduleItem) => void
  onDelete: (id: string) => void
}

export default function DayColumn({ tripId, dayIndex, date, items, canEdit, onUpdate, onAdd, onDelete }: Props) {
  const [adding, setAdding] = useState(false)

  return (
    <div className="bg-gray-50 rounded-2xl p-4">
      <h3 className="font-bold text-base mb-3">
        Day {dayIndex}
        <span className="font-normal text-gray-400 text-sm ml-2">{date}</span>
      </h3>
      <div className="space-y-2">
        {items.map(item => (
          <ScheduleItemCard
            key={item.id}
            item={item}
            canEdit={canEdit}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
        {adding ? (
          <ScheduleItemForm
            tripId={tripId}
            dayIndex={dayIndex}
            onSave={item => { onAdd(item); setAdding(false) }}
            onCancel={() => setAdding(false)}
          />
        ) : canEdit ? (
          <button
            onClick={() => setAdding(true)}
            className="w-full py-2 text-sm text-blue-500 border-2 border-dashed border-blue-200 rounded-xl hover:bg-blue-50"
          >
            + 일정 추가
          </button>
        ) : null}
      </div>
    </div>
  )
}

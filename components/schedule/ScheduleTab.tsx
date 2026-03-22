'use client'

import { useState, useEffect } from 'react'
import { ScheduleItem } from '@/types'
import DayColumn from './DayColumn'

interface Props {
  tripId: string
  startDate: string
  endDate: string
  canEdit: boolean
}

function getDaysArray(start: string, end: string): string[] {
  const days: string[] = []
  const current = new Date(start)
  const last = new Date(end)
  while (current <= last) {
    days.push(current.toISOString().split('T')[0])
    current.setDate(current.getDate() + 1)
  }
  return days
}

export default function ScheduleTab({ tripId, startDate, endDate, canEdit }: Props) {
  const [items, setItems] = useState<ScheduleItem[]>([])
  const days = getDaysArray(startDate, endDate)

  useEffect(() => {
    fetch(`/api/schedule-items?trip_id=${tripId}`)
      .then(r => r.json())
      .then(setItems)
  }, [tripId])

  function handleUpdate(updated: ScheduleItem) {
    setItems(prev => prev.map(i => i.id === updated.id ? updated : i))
  }

  function handleAdd(item: ScheduleItem) {
    setItems(prev => [...prev, item])
  }

  function handleDelete(id: string) {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  return (
    <div className="p-4 space-y-4">
      {days.map((date, idx) => (
        <DayColumn
          key={date}
          tripId={tripId}
          dayIndex={idx + 1}
          date={date}
          items={items.filter(i => i.day_index === idx + 1)}
          canEdit={canEdit}
          onUpdate={handleUpdate}
          onAdd={handleAdd}
          onDelete={handleDelete}
        />
      ))}
    </div>
  )
}

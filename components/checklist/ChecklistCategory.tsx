'use client'

import { useState } from 'react'
import { ChecklistItem } from '@/types'
import ChecklistItemRow from './ChecklistItemRow'

interface Props {
  tripId: string
  category: string
  items: ChecklistItem[]
  canEdit: boolean
  onToggle: (item: ChecklistItem) => void
  onAdd: (item: ChecklistItem) => void
  onDelete: (id: string) => void
}

export default function ChecklistCategory({ tripId, category, items, canEdit, onToggle, onAdd, onDelete }: Props) {
  const [adding, setAdding] = useState(false)
  const [newContent, setNewContent] = useState('')

  const checked = items.filter(i => i.is_checked).length

  async function handleAdd() {
    if (!newContent.trim()) return
    const res = await fetch('/api/checklist-items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        trip_id: tripId,
        category,
        content: newContent.trim(),
        is_checked: false,
        is_template: false,
        sort_order: items.length,
      }),
    })
    if (!res.ok) return
    const item = await res.json()
    onAdd(item)
    setNewContent('')
    setAdding(false)
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold">{category}</h3>
        <span className="text-sm text-gray-400">{checked}/{items.length}</span>
      </div>
      <div className="divide-y">
        {items.map(item => (
          <ChecklistItemRow
            key={item.id}
            item={item}
            canEdit={canEdit}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))}
      </div>
      {canEdit && (
        adding ? (
          <div className="flex gap-2 mt-3">
            <input
              type="text"
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="항목 입력"
              className="flex-1 border rounded-lg px-3 py-1.5 text-sm"
              autoFocus
            />
            <button onClick={handleAdd} className="bg-blue-500 text-white rounded-lg px-3 py-1.5 text-sm">추가</button>
            <button onClick={() => setAdding(false)} className="text-gray-400 text-sm px-2">취소</button>
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="mt-3 text-sm text-blue-500 hover:underline"
          >
            + 항목 추가
          </button>
        )
      )}
    </div>
  )
}
